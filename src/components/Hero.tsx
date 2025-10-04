import React, { useEffect, useState } from 'react';
import { Sword, Trophy, Coins } from 'lucide-react';

export const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 50%)`,
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #3b82f6 2px, #3b82f6 4px)`,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <h1
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          Chain Warriors
        </h1>

        <p
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        >
          Battle, trade, and dominate in the ultimate on-chain gaming experience.
          Every move, every battle, every trade is recorded on the blockchain.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transform hover:scale-105 transition-transform"
            style={{
              transform: `translateY(${Math.min(scrollY * 0.1, 50)}px)`,
            }}
          >
            <Sword className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Epic Battles</h3>
            <p className="text-gray-400">
              Engage in strategic combat with on-chain battle mechanics
            </p>
          </div>

          <div
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transform hover:scale-105 transition-transform"
            style={{
              transform: `translateY(${Math.min(scrollY * 0.08, 40)}px)`,
            }}
          >
            <Trophy className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">NFT Warriors</h3>
            <p className="text-gray-400">
              Collect and level up unique NFT characters with verifiable stats
            </p>
          </div>

          <div
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transform hover:scale-105 transition-transform"
            style={{
              transform: `translateY(${Math.min(scrollY * 0.06, 30)}px)`,
            }}
          >
            <Coins className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">True Ownership</h3>
            <p className="text-gray-400">
              Trade your warriors on the decentralized marketplace
            </p>
          </div>
        </div>

        <button
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg shadow-blue-500/50 hover:shadow-blue-600/50 transition-all"
          onClick={() => {
            document.getElementById('game-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Enter the Arena
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-gray-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
