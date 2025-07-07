import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden" style={{ backgroundImage: 'url(/bg.png)' }}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-extrabold drop-shadow-2xl animate-pulse">
          APLIKASI DOORPRIZE
        </h1>
        
        {/* Subtitle */}
        {/* <p className="text-xl text-white/80 mb-12 font-light">
          Event Doorprize Digital yang Menarik
        </p> */}

        {/* Session buttons */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 drop-shadow-lg">
            Pilih Sesi Undian
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <button
              className="group relative px-8 py-6 text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 border border-blue-400/20"
              onClick={() => navigate('/ses21')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 font-bold">Sesi 1</span>
              <div className="absolute top-2 right-2 text-sm opacity-60">🎁</div>
            </button>
            
            <button
              className="group relative px-8 py-6 text-2xl bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 border border-green-400/20"
              onClick={() => navigate('/ses22')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 font-bold">Sesi 2</span>
              <div className="absolute top-2 right-2 text-sm opacity-60">🎁</div>
            </button>
            
            <button
              className="group relative px-8 py-6 text-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 border border-purple-400/20"
              onClick={() => navigate('/ses23')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 font-bold">Sesi 3</span>
              <div className="absolute top-2 right-2 text-sm opacity-60">🎁</div>
            </button>
          </div>
        </div>

        {/* Special buttons */}
        <div className="space-y-6">
          <button
            className="group relative px-10 py-6 text-3xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50 border border-yellow-400/20 font-bold"
            onClick={() => navigate('/grandprize')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">🏆 Grand Prize</span>
            <div className="absolute top-3 right-3 text-sm opacity-60">👑</div>
          </button>
          
          <div className="mt-8">
            <button
              className="group relative px-8 py-4 text-xl bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-gray-500/30 border border-gray-600/20"
              onClick={() => navigate('/utils')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 font-semibold">⚙️ Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
};

export default Home;
