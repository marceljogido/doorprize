import React, { useState, useEffect, useRef } from 'react';
import { useGuests } from '../context/GuestContext';
import { useNavigate } from 'react-router-dom';
import TrophyRain from './GrandPrizeTrophyRain';

const GrandPrize: React.FC = () => {
  const { guests, setGuests, removeGuest } = useGuests();
  const [winner, setWinner] = useState<{ name: string, divisi: string, npp: string }>({ name: '', divisi: '', npp: '' });
  const [tempWinner, setTempWinner] = useState<{ name: string, divisi: string, npp: string }>({ name: '', divisi: '', npp: '' });
  const [isDrawing, setIsDrawing] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showPopup && confettiRef.current) {
      // Confetti sederhana: generate 40 elemen confetti
      const confettiContainer = confettiRef.current;
      confettiContainer.innerHTML = '';
      for (let i = 0; i < 500; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = Math.random() * 100 + '%';
        conf.style.backgroundColor = `hsl(${Math.random()*360},90%,60%)`;
        conf.style.animationDelay = (Math.random() * 0.7) + 's';
        confettiContainer.appendChild(conf);
      }
    }
  }, [showPopup]);

  const handleDraw = () => {
    if (isDrawing) return;
    setWinner({ name: '', divisi: '', npp: '' });
    setTempWinner({ name: '', divisi: '', npp: '' });
    setIsDrawing(true);

    // Semua tamu eligible (tanpa filter status)
    const eligibleGuests = guests;

    const newIntervalId = setInterval(() => {
      const randomGuest = eligibleGuests[Math.floor(Math.random() * eligibleGuests.length)];
      setTempWinner(randomGuest);
    }, 100);

    setIntervalId(newIntervalId);
  };

  const handleStop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    // Semua tamu eligible (tanpa filter status)
    const eligibleGuests = guests;
    const randomGuest = eligibleGuests[Math.floor(Math.random() * eligibleGuests.length)];
    setWinner(randomGuest);
    setTempWinner(randomGuest);
    removeGuest(randomGuest.name);
    setIsDrawing(false);
    setShowPopup(true);
  };

  const handleBoxClick = () => {
    if (isDrawing) {
      // Jika sedang undian, hentikan
      handleStop();
    } else {
      // Jika tidak sedang undian, mulai undian
      handleDraw();
    }
  };

  // Helper untuk menampilkan data pemenang (tempWinner prioritas, fallback ke winner)
  const displayWinner = tempWinner.name || winner.name ? (tempWinner.name ? tempWinner : winner) : null;

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: "url(/backgrounds/bgbg.jpg)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", minHeight: "100vh", width: "100%" }}>
      <TrophyRain />
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 px-4 py-2 w-12 h-12 bg-transparent border-transparent text-transparent hover:bg-transparent"
      >
        &larr;
      </button>
      <div 
        className="flex flex-col items-end w-full pr-[8rem] pt-[5rem]"
      >
        <div
          className={`w-[500px] h-[180px] rounded-xl flex flex-col items-center justify-center text-white text-4xl select-none cursor-pointer transition-all duration-300 transform hover:scale-102 ${
            isDrawing 
              ? 'bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-500/30 border border-teal-500 animate-pulse' 
              : winner.name 
              ? 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-lg shadow-emerald-500/30 border border-emerald-500' 
              : 'bg-gradient-to-br from-slate-700 to-gray-800 shadow-md border border-slate-600'
          }`}
          onClick={handleBoxClick}
        >
          <div className="font-bold text-3xl break-words text-center" style={{color: 'white', textShadow: '0 0 10px #fff'}}>
            {displayWinner ? displayWinner.name : 'Mulai Undian Sekarang'}
          </div>
        <div className="text-lg mt-1">
            {displayWinner ? displayWinner.divisi : ''}
          </div>
          {/* NPP disembunyikan dari tampilan pemenang */}
          {/* <div className="text-base mt-1 italic text-gray-200">
            {displayWinner ? displayWinner.npp : ''}
          </div> */}
        </div>
      </div>
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          {/* Confetti overlay */}
          <div ref={confettiRef} className="pointer-events-none absolute inset-0 z-50"></div>
          <div className="relative bg-gradient-to-br from-yellow-100 via-pink-100 to-teal-100 rounded-2xl shadow-2xl p-12 flex flex-col items-center animate-popup-zoom">
            {/* Icon piala (trophy) */}
            <svg className="mb-4" width="80" height="80" viewBox="0 0 24 24" fill="#FFCA28">
              {/* Trophy */}
              <path d="M5 2v2H3v4a5 5 0 0 0 5 5v1H8v2h2v2H9v2h6v-2h-1v-2h2v-2h-1v-1h1a5 5 0 0 0 5-5V4h-2V2zM5 6h1v2H5zm13 0h1v2h-1z"/>
              {/* Star in center */}
              <path fill="#fff" d="M12 8l.5 1.5H14l-1.25.9.5 1.5L12 11l-1.25.9.5-1.5L10 9.5h1.5z"/>
            </svg>
            <div className="text-5xl font-extrabold text-teal-700 mb-4 text-center break-words max-w-[500px] animate-bounce-winner drop-shadow-lg" style={{textShadow:'0 0 10px #fff, 0 0 20px #fbbf24'}}>{winner.name}</div>
            <div className="text-2xl text-pink-600 mb-2 font-semibold animate-fadein">{winner.divisi}</div>
            {/* NPP disembunyikan dari tampilan pemenang */}
            {/* <div className="text-lg text-gray-700 mb-2 animate-fadein">{winner.npp}</div> */}
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 px-8 py-3 bg-teal-500 text-white rounded-lg text-xl font-bold shadow-lg hover:bg-teal-600 hover:scale-105 transition-transform"
            >
              Tutup
            </button>
          </div>
          {/* Confetti CSS */}
          <style>{`
            .confetti {
              position: absolute;
              top: -20px;
              width: 16px;
              height: 16px;
              border-radius: 3px;
              opacity: 0.85;
              animation: confetti-fall 1.7s cubic-bezier(.6,.4,.4,1) forwards;
            }
            @keyframes confetti-fall {
              to {
                top: 100vh;
                transform: rotate(360deg) scale(0.7);
                opacity: 0.7;
              }
            }
            .animate-popup-zoom {
              animation: popup-zoom 0.5s cubic-bezier(.5,1.7,.5,1) forwards;
            }
            @keyframes popup-zoom {
              0% { transform: scale(0.5); opacity: 0; }
              80% { transform: scale(1.08); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-bounce-winner {
              animation: bounce-winner 1.1s cubic-bezier(.5,1.7,.5,1) 1;
            }
            @keyframes bounce-winner {
              0% { transform: scale(0.5); opacity: 0; }
              60% { transform: scale(1.2); opacity: 1; }
              80% { transform: scale(0.95); }
              100% { transform: scale(1); }
            }
            .animate-fadein {
              animation: fadein 1.2s ease 0.3s both;
            }
            @keyframes fadein {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default GrandPrize;
