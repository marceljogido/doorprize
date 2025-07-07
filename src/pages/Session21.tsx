import React, { useState, useEffect, useRef } from 'react';
import { useGuests } from '../context/GuestContext';
import { useNavigate } from 'react-router-dom';

const hadiahSesi1 = [
  { nama: 'Voucher 100k', jumlah: 80 },
  { nama: 'Voucher 300k', jumlah: 60 },
  { nama: 'Voucher 500k', jumlah: 15 },
  { nama: 'Shokz Bone Conduction OpenMove', jumlah: 6 },
];
const BATCH_SIZE = 10;

const getBatchSize = (hadiahJumlah: number) => {
  return hadiahJumlah === 15 ? 15 : BATCH_SIZE;
};

const Session21: React.FC = () => {
  const { guests, setGuests, removeGuest, loadGuestsFromLocalStorage } = useGuests();
  const [guestList, setGuestList] = useState(guests);
  const [hadiahIndex, setHadiahIndex] = useState(0);
  const [batchIndex, setBatchIndex] = useState(0);
  const [winners, setWinners] = useState<{ name: string, divisi: string, npp: string }[]>([]);
  const [batchWinners, setBatchWinners] = useState<{ name: string, divisi: string, npp: string }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [randomNames, setRandomNames] = useState<string[]>(Array(BATCH_SIZE).fill(''));
  const [shokzWinners, setShokzWinners] = useState<(null | { name: string, divisi: string, npp: string })[]>([]);
  const [shokzSpinning, setShokzSpinning] = useState<boolean[]>([]);
  const [shokzRandomNames, setShokzRandomNames] = useState<string[]>([]);
  const [shokzIntervalIds, setShokzIntervalIds] = useState<(NodeJS.Timeout | null)[]>([]);
  const navigate = useNavigate();

  const getCurrentHadiah = () => {
    if (hadiahIndex >= hadiahSesi1.length) {
      return null;
    }
    return hadiahSesi1[hadiahIndex];
  };
  const getTotalBatch = () => {
    const currentHadiah = getCurrentHadiah();
    if (!currentHadiah) return 0;
    const batchSize = getBatchSize(currentHadiah.jumlah);
    return Math.ceil(currentHadiah.jumlah / batchSize);
  };

  const currentHadiah = getCurrentHadiah();

  useEffect(() => {
    loadGuestsFromLocalStorage();
  }, []);

  useEffect(() => {
    setGuestList(guests);
  }, [guests]);

  // Reset state saat pindah hadiah
  useEffect(() => {
    setBatchIndex(0);
    setWinners([]);
    setBatchWinners([]);
    const batchSize = currentHadiah ? getBatchSize(currentHadiah.jumlah) : BATCH_SIZE;
    setRandomNames(Array(batchSize).fill(''));
    if (currentHadiah && currentHadiah.nama === 'Shokz Bone Conduction OpenMove') {
      setShokzWinners(Array(currentHadiah.jumlah).fill(null));
      setShokzSpinning(Array(currentHadiah.jumlah).fill(false));
      setShokzRandomNames(Array(currentHadiah.jumlah).fill(''));
      setShokzIntervalIds(Array(currentHadiah.jumlah).fill(null));
    }
  }, [hadiahIndex]);

  const drawBatchWinners = () => {
    const currentHadiah = getCurrentHadiah();
    if (!currentHadiah) return [];

    let remainingGuests = [...guestList];
    const selected: { name: string, divisi: string, npp: string }[] = [];
    const batchSize = getBatchSize(currentHadiah.jumlah);
    for (let i = 0; i < batchSize; i++) {
      if (winners.length + selected.length >= currentHadiah.jumlah) break;
      if (remainingGuests.length === 0) break;
      const randomIndex = Math.floor(Math.random() * remainingGuests.length);
      const winner = remainingGuests[randomIndex];
      selected.push(winner);
      remainingGuests = remainingGuests.filter(g => g.name !== winner.name);
    }
    setGuestList(remainingGuests);
    setGuests(remainingGuests);
    localStorage.setItem('guests', JSON.stringify(remainingGuests));
    selected.forEach(winner => removeGuest(winner.name));
    return selected;
  };

  const intervalIdsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const handleDraw = () => {
    if (isDrawing || guestList.length === 0) return;
    const currentHadiah = getCurrentHadiah();
    if (!currentHadiah) return;
    
    const batchSize = getBatchSize(currentHadiah.jumlah);
    setBatchWinners([]);
    setRandomNames(Array(batchSize).fill(''));
    setIsDrawing(true);
    
    // Mulai animasi shuffle tanpa delay
    const newIntervalIds: ReturnType<typeof setInterval>[] = [];
    
    for (let idx = 0; idx < batchSize; idx++) {
      const intervalId = setInterval(() => {
        setRandomNames(prev => {
          const updated = [...prev];
          updated[idx] = guestList[Math.floor(Math.random() * guestList.length)]?.name || '';
          return updated;
        });
      }, 100);
      newIntervalIds.push(intervalId);
    }
    
    intervalIdsRef.current = newIntervalIds;
  };

  const handleStop = () => {
    // Clear semua interval
    intervalIdsRef.current.forEach(id => clearInterval(id));
    intervalIdsRef.current = [];
    setIsDrawing(false);
    
    // Pilih pemenang saat stop ditekan
    const newBatch = drawBatchWinners();
    setBatchWinners(newBatch);
  };

  const handleNextBatch = () => {
    setWinners(prev => [...prev, ...batchWinners]);
    setBatchIndex(batchIndex + 1);
    setBatchWinners([]);
    const batchSize = currentHadiah ? getBatchSize(currentHadiah.jumlah) : BATCH_SIZE;
    setRandomNames(Array(batchSize).fill(''));
  };

  const handleNextHadiah = () => {
    setHadiahIndex(hadiahIndex + 1);
    setBatchIndex(0);
    setWinners([]);
    setBatchWinners([]);
    const batchSize = currentHadiah ? getBatchSize(currentHadiah.jumlah) : BATCH_SIZE;
    setRandomNames(Array(batchSize).fill(''));
  };

  // Handler klik box untuk undian per box Shokz
  const handleShokzBoxClick = (idx: number) => {
    if (shokzSpinning[idx]) {
      if (shokzIntervalIds[idx]) clearInterval(shokzIntervalIds[idx]!);
      // Pilih pemenang acak
      let remaining = [...guestList];
      shokzWinners.forEach((w, i) => {
        if (w && i !== idx) remaining = remaining.filter(g => g.name !== w.name);
      });
      const winner = remaining[Math.floor(Math.random() * remaining.length)];
      if (winner) {
        setShokzWinners(prev => {
          const updated = [...prev];
          updated[idx] = winner;
          return updated;
        });
        setGuestList(remaining.filter(g => g.name !== winner.name));
        setGuests(remaining.filter(g => g.name !== winner.name));
        localStorage.setItem('guests', JSON.stringify(remaining.filter(g => g.name !== winner.name)));
        removeGuest(winner.name);
        setShokzRandomNames(prev => {
          const updated = [...prev];
          updated[idx] = winner.name;
          return updated;
        });
      }
      setShokzSpinning(prev => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      });
      setShokzIntervalIds(prev => {
        const updated = [...prev];
        updated[idx] = null;
        return updated;
      });
      return;
    }
    // Jika sudah ada nama (dan tidak sedang spin), klik = undi ulang (spin ulang)
    if (shokzWinners[idx] && !shokzSpinning[idx]) {
      setShokzWinners(prev => {
        const updated = [...prev];
        updated[idx] = null;
        return updated;
      });
      setShokzRandomNames(prev => {
        const updated = [...prev];
        updated[idx] = '';
        return updated;
      });
    }
    // Mulai spin
    setShokzSpinning(prev => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
    const spinInterval = setInterval(() => {
      setShokzRandomNames(prev => {
        const updated = [...prev];
        updated[idx] = guestList[Math.floor(Math.random() * guestList.length)]?.name || '';
        return updated;
      });
    }, 100);
    setShokzIntervalIds(prev => {
      const updated = [...prev];
      updated[idx] = spinInterval;
      return updated;
    });
  };

  // Keyboard shortcut untuk undi
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (currentHadiah && currentHadiah.nama === 'Shokz Bone Conduction OpenMove') return; // Nonaktifkan shortcut
      if (event.code === 'Space') {
        event.preventDefault();
        if (!currentHadiah) return;
        const batchSize = getBatchSize(currentHadiah.jumlah);
        const startNo = batchIndex * batchSize + 1;
        const endNo = Math.min(startNo + batchSize - 1, currentHadiah.jumlah);
        const currentBatch = Array.from({ length: endNo - startNo + 1 }, (_, i) => i + startNo);
        
        if (isDrawing) {
          handleStop();
        } else if (!isDrawing && batchWinners.length === 0 && winners.length + currentBatch.length <= currentHadiah.jumlah) {
          handleDraw();
        }
      } else if (event.code === 'Enter') {
        event.preventDefault();
        if (!currentHadiah) return;
        const batchSize = getBatchSize(currentHadiah.jumlah);
        const startNo = batchIndex * batchSize + 1;
        const endNo = Math.min(startNo + batchSize - 1, currentHadiah.jumlah);
        const currentBatch = Array.from({ length: endNo - startNo + 1 }, (_, i) => i + startNo);
        
        // Next batch
        if (!isDrawing && batchWinners.length > 0 && winners.length + currentBatch.length < currentHadiah.jumlah) {
          handleNextBatch();
        }
        // Next hadiah
        else if (!isDrawing && batchWinners.length > 0 && winners.length + currentBatch.length === currentHadiah.jumlah) {
          handleNextHadiah();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isDrawing, batchWinners.length, winners.length, batchIndex, currentHadiah]);

  // Hitung nomor box untuk batch saat ini
  if (currentHadiah && currentHadiah.nama === 'Shokz Bone Conduction OpenMove') {
    if (!currentHadiah) return null;
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
        <div className="mt-2 mb-16 text-6xl font-extrabold font-montserrat drop-shadow-2xl relative overflow-hidden">
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
                shokzSpinning[idx]
                  ? 'bg-gradient-to-br from-blue-100 to-blue-300 shadow-lg shadow-blue-200/30 border border-blue-200 animate-pulse text-black'
                  : shokzWinners[idx]
                  ? 'bg-gradient-to-br from-blue-100 to-blue-300 shadow-lg shadow-blue-200/30 border border-blue-200 text-black'
                  : 'bg-gradient-to-br from-slate-600 to-gray-700 shadow-md border border-slate-500 text-white opacity-80'
              }`}
              onClick={() => handleShokzBoxClick(idx)}
            >
              <div className="font-bold text-xl break-words text-center">
                {shokzWinners[idx]?.name || (shokzSpinning[idx] ? shokzRandomNames[idx] : '') || ''}
              </div>
              <div className="text-base mt-1">
                {shokzWinners[idx]?.divisi || ''}
              </div>
              <div className="text-base mt-1 text-gray-500">
                {shokzWinners[idx]?.npp || ''}
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-4 mt-10">
          {hadiahIndex < hadiahSesi1.length - 1 && shokzWinners.every(w => w) && (
            <button
              onClick={handleNextHadiah}
              className="px-6 py-3 bg-blue-500 text-white rounded text-2xl hover:bg-blue-600 opacity-0 pointer-events-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1"
              title="Tekan ENTER untuk lanjut hadiah"
            >
              Lanjut Hadiah Berikutnya
            </button>
          )}
          {hadiahIndex === hadiahSesi1.length - 1 && shokzWinners.every(w => w) && (
            <button
              onClick={() => setHadiahIndex(hadiahSesi1.length)}
              className="px-6 py-3 bg-transparent border-transparent text-transparent w-12 h-12 opacity-0 pointer-events-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1"
              title="Tekan ENTER untuk selesai"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    );
  }
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
            Semua Hadiah Sesi 1
          </p>
          
          {/* Description */}
          <p className="text-xl text-white/70 mb-12 font-light max-w-2xl mx-auto">
            Telah berhasil dibagikan kepada para pemenang yang beruntung!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-yellow-400 mb-2">171</div>
              <div className="text-white/80">Total Pemenang</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-blue-400 mb-2">4</div>
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
              onClick={() => navigate('/ses22')}
              className="group relative px-8 py-4 text-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 border border-blue-400/20 font-bold"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">🎁 Lanjut ke Sesi 2</span>
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

  const batchSize = getBatchSize(currentHadiah.jumlah);
  const startNo = batchIndex * batchSize + 1;
  const endNo = Math.min(startNo + batchSize - 1, currentHadiah.jumlah);
  const currentBatch = Array.from({ length: endNo - startNo + 1 }, (_, i) => i + startNo);
  
  // Untuk hadiah 15 pemenang, tampilkan semua box sekaligus
  const displayBatch = currentHadiah.jumlah === 15 
    ? Array.from({ length: currentHadiah.jumlah }, (_, i) => i + 1)
    : currentBatch;

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/bg.png)' }}>
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 px-4 py-2 w-12 h-12 bg-transparent border-transparent text-transparent hover:bg-transparent"
      >
        &larr;
      </button>
      <div className="mt-2 mb-16 text-6xl font-extrabold font-montserrat drop-shadow-2xl relative overflow-hidden">
        <div className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] bg-[position:-200%_center]">
          {currentHadiah.nama}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
      <div className={`grid gap-4 mb-8 ${
        currentHadiah.jumlah === 6 
          ? 'grid-cols-3' 
          : currentHadiah.jumlah === 15
          ? 'grid-cols-5'
          : 'grid-cols-2 md:grid-cols-5'
      }`}>
        {displayBatch.map((no, idx) => (
          <div 
            key={no} 
            className={`relative p-4 w-60 h-39 rounded-2xl text-center text-2xl text-black flex flex-col justify-center items-center transition-all duration-300 transform hover:scale-105 ${
              currentHadiah.jumlah === 15 
                ? 'w-58 h-40' 
                : 'w-64 h-48'
            } ${
              batchWinners[idx] 
                ? 'bg-gradient-to-br from-blue-100 to-blue-300 shadow-lg shadow-blue-200/30 border border-blue-200' 
                : randomNames[idx] 
                ? 'bg-gradient-to-br from-blue-100 to-blue-300 shadow-lg shadow-blue-200/30 border border-blue-200 animate-pulse' 
                : 'bg-gradient-to-br from-slate-600 to-gray-700 shadow-md border border-slate-500 text-white opacity-80'
            }`}
          >
            {/* Nomor box */}
            <div className="absolute top-2 left-3 text-xs font-bold bg-black/20 px-2 py-1 rounded-full text-white">
              {no}
            </div>
            <div className="font-bold text-xl break-words text-center">
              {batchWinners[idx]?.name || (isDrawing ? randomNames[idx] : '') || ''}
            </div>
            <div className="text-base mt-1">
              {batchWinners[idx]?.divisi || ''}
            </div>
            <div className="text-base mt-1 text-gray-500">
              {batchWinners[idx]?.npp || ''}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-4 mt-6">
        {!isDrawing && batchWinners.length === 0 && winners.length + currentBatch.length <= currentHadiah.jumlah && (
          <button
            onClick={handleDraw}
            className="px-6 py-3 bg-teal-500 text-white rounded text-2xl hover:bg-teal-600 opacity-0 pointer-events-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1"
            title="Tekan SPACE untuk undi"
          >
            Undi
          </button>
        )}
        {isDrawing && (
          <button
            onClick={handleStop}
            className="px-6 py-3 bg-red-500 text-white rounded text-2xl hover:bg-red-600 opacity-0 pointer-events-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1"
            title="Tekan SPACE untuk stop"
          >
            Stop
          </button>
        )}
        {!isDrawing && batchWinners.length > 0 && winners.length + currentBatch.length < currentHadiah.jumlah && (
          <button
            onClick={handleNextBatch}
            className="px-6 py-3 bg-yellow-500 text-white rounded text-2xl hover:bg-yellow-600 opacity-0 pointer-events-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1"
            title="Tekan ENTER untuk next batch"
          >
            Next
          </button>
        )}
        {!isDrawing && batchWinners.length > 0 && winners.length + currentBatch.length === currentHadiah.jumlah && (
          <button
            onClick={handleNextHadiah}
            className="px-6 py-3 bg-green-500 text-white rounded text-2xl hover:bg-green-600 opacity-0 pointer-events-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1"
            title="Tekan ENTER untuk lanjut hadiah"
          >
            Lanjut Hadiah Berikutnya
          </button>
        )}
      </div>
    </div>
  );
};

export default Session21;
