import React, { useState, useEffect } from 'react';
import { useGuests } from '../context/GuestContext';
import { useNavigate } from 'react-router-dom';

const hadiahSesi2 = [
  { nama: 'Huawei Watch Fit 4', jumlah: 6 },
  { nama: 'Samsung Tab A9 (Wifi)', jumlah: 6 },
  { nama: 'LM 0,5 Gram', jumlah: 6 },
  { nama: 'LM 1 Gram', jumlah: 3 },
  { nama: 'VIVO Y29 6GB - 128', jumlah: 6 },
];

const Session22: React.FC = () => {
  const { guests, setGuests, removeGuest, loadGuestsFromLocalStorage } = useGuests();
  const [guestList, setGuestList] = useState(guests);
  const [hadiahIndex, setHadiahIndex] = useState(0);
  const [winners, setWinners] = useState<(null | { name: string, divisi: string, npp: string })[]>([]);
  const [spinning, setSpinning] = useState<boolean[]>([]);
  const [randomNames, setRandomNames] = useState<string[]>([]);
  const [intervalIds, setIntervalIds] = useState<(NodeJS.Timeout | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadGuestsFromLocalStorage();
  }, []);

  useEffect(() => {
    setGuestList(guests);
  }, [guests]);

  useEffect(() => {
    // Reset state saat pindah hadiah
    const jumlah = getCurrentHadiah()?.jumlah || 0;
    setWinners(Array(jumlah).fill(null));
    setSpinning(Array(jumlah).fill(false));
    setRandomNames(Array(jumlah).fill(''));
    setIntervalIds(Array(jumlah).fill(null));
  }, [hadiahIndex]);

  const getCurrentHadiah = () => {
    if (hadiahIndex >= hadiahSesi2.length) return null;
    return hadiahSesi2[hadiahIndex];
  };

  const handleBoxClick = (idx: number) => {
    // Jika sedang spin, klik = stop dan pilih pemenang
    if (spinning[idx]) {
      if (intervalIds[idx]) clearInterval(intervalIds[idx]!);
      // Pilih pemenang acak
      let remaining = [...guestList];
      winners.forEach((w, i) => {
        if (w && i !== idx) remaining = remaining.filter(g => g.name !== w.name);
      });
      const winner = remaining[Math.floor(Math.random() * remaining.length)];
      if (winner) {
        setWinners(prev => {
          const updated = [...prev];
          updated[idx] = winner;
          return updated;
        });
        setGuestList(remaining.filter(g => g.name !== winner.name));
        setGuests(remaining.filter(g => g.name !== winner.name));
        localStorage.setItem('guests', JSON.stringify(remaining.filter(g => g.name !== winner.name)));
        removeGuest(winner.name);
        setRandomNames(prev => {
          const updated = [...prev];
          updated[idx] = winner.name;
          return updated;
        });
      }
      setSpinning(prev => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      });
      setIntervalIds(prev => {
        const updated = [...prev];
        updated[idx] = null;
        return updated;
      });
      return;
    }
    // Jika sudah ada nama (dan tidak sedang spin), klik = undi ulang (spin ulang)
    if (winners[idx] && !spinning[idx]) {
      setWinners(prev => {
        const updated = [...prev];
        updated[idx] = null;
        return updated;
      });
      setRandomNames(prev => {
        const updated = [...prev];
        updated[idx] = '';
        return updated;
      });
    }
    // Mulai spin
    setSpinning(prev => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
    const spinInterval = setInterval(() => {
      setRandomNames(prev => {
        const updated = [...prev];
        updated[idx] = guestList[Math.floor(Math.random() * guestList.length)]?.name || '';
        return updated;
      });
    }, 80);
    setIntervalIds(prev => {
      const updated = [...prev];
      updated[idx] = spinInterval;
      return updated;
    });
  };

  const handleNext = () => {
    navigate('/');
  };

  // Keyboard shortcut untuk tombol next/selesai
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Enter') {
        event.preventDefault();
        const currentHadiah = getCurrentHadiah();
        if (!currentHadiah) return;
        
        // Next hadiah
        if (hadiahIndex < hadiahSesi2.length - 1 && winners.every(w => w)) {
          setHadiahIndex(hadiahIndex + 1);
        }
        // Selesai - set hadiahIndex ke nilai yang melebihi array length
        else if (hadiahIndex === hadiahSesi2.length - 1 && winners.every(w => w)) {
          setHadiahIndex(hadiahSesi2.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hadiahIndex, winners, hadiahSesi2.length]);

  const currentHadiah = getCurrentHadiah();
  if (!currentHadiah) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: 'url(/bg.png)' }}>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 px-4 py-2 w-12 h-12 bg-transparent border-transparent text-transparent hover:bg-transparent"
        >
          &larr;
        </button>

        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Success icon */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 font-extrabold drop-shadow-2xl animate-pulse">
            🎉 SELESAI! 🎉
          </h1>
          
          {/* Subtitle */}
          <p className="text-3xl text-white/90 mb-8 font-semibold drop-shadow-lg">
            Semua Hadiah Sesi 2
          </p>
          
          {/* Description */}
          <p className="text-xl text-white/70 mb-12 font-light max-w-2xl mx-auto">
            Telah berhasil dibagikan kepada para pemenang yang beruntung!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-yellow-400 mb-2">27</div>
              <div className="text-white/80">Total Pemenang</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-blue-400 mb-2">5</div>
              <div className="text-white/80">Jenis Hadiah</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-white/80">Berhasil</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/ses23')}
              className="group relative px-8 py-4 text-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 border border-purple-400/20 font-bold"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">🎁 Lanjut ke Sesi 3</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="group relative px-8 py-4 text-xl bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-500 hover:to-gray-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-gray-500/30 border border-gray-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">🏠 Kembali ke Menu Utama</span>
            </button>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Layout grid dinamis: max 3 kolom, baris menyesuaikan
  const gridCols = currentHadiah.jumlah <= 3 ? currentHadiah.jumlah : 3;
  const gridRows = Math.ceil(currentHadiah.jumlah / 3);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/bg.png)' }}>
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 px-4 py-2 w-12 h-12 bg-transparent border-transparent text-transparent hover:bg-transparent"
      >
        &larr;
      </button>
      <div className="mt-2 mb-6 text-6xl font-extrabold font-montserrat drop-shadow-2xl relative overflow-hidden">
        <div className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] bg-[position:-200%_center]">
          {currentHadiah.nama}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
      <div
        className={`grid gap-8 mb-8 mt-8`} 
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: currentHadiah.jumlah }).map((_, idx) => (
          <div
            key={idx}
            className={`p-4 w-[22rem] h-48 rounded-2xl text-center text-3xl flex flex-col justify-center items-center cursor-pointer select-none transition-all duration-300 transform hover:scale-105 ${
              spinning[idx] 
                ? 'bg-gradient-to-br from-blue-100 to-blue-300 shadow-lg shadow-blue-200/30 border border-blue-200 animate-pulse text-black' 
                : winners[idx] 
                ? 'bg-gradient-to-br from-blue-100 to-blue-300 shadow-lg shadow-blue-200/30 border border-blue-200 text-black' 
                : 'bg-gradient-to-br from-slate-600 to-gray-700 shadow-md border border-slate-500 text-white opacity-80'
            }`}
            onClick={() => handleBoxClick(idx)}
          >
            <div className="font-bold text-xl break-words text-center">
              {winners[idx]?.name || (spinning[idx] ? randomNames[idx] : '') || ''}
            </div>
            <div className="text-base mt-1">
              {winners[idx]?.divisi || ''}
            </div>
            <div className="text-base mt-1 text-gray-500">
              {winners[idx]?.npp || ''}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-4 mt-10">
        {hadiahIndex === hadiahSesi2.length - 1 && winners.every(w => w) && (
          <button
            onClick={() => {
              // Set hadiahIndex ke nilai yang melebihi array length
              // agar getCurrentHadiah() return null dan menampilkan halaman selesai
              setHadiahIndex(hadiahSesi2.length);
            }}
            className="px-6 py-3 bg-transparent border-transparent text-transparent w-12 h-12 opacity-0 pointer-events-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1"
            title="Tekan ENTER untuk selesai"
          >
            Selesai
          </button>
        )}
        {hadiahIndex < hadiahSesi2.length - 1 && winners.every(w => w) && (
          <button
            onClick={() => setHadiahIndex(hadiahIndex + 1)}
            className="px-6 py-3 bg-blue-500 text-white rounded text-2xl hover:bg-blue-600 opacity-0 pointer-events-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1"
            title="Tekan ENTER untuk lanjut hadiah"
          >
            Lanjut Hadiah Berikutnya
          </button>
        )}
      </div>
    </div>
  );
};

export default Session22;
