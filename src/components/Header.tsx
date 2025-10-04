import React from 'react';
import { Wallet, LogOut, User } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

interface HeaderProps {
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { currentUser, logout } = useGame();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚔️</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Chain Warriors
              </h1>
              <p className="text-xs text-gray-500">On-Chain Gaming</p>
            </div>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <div className="text-white font-bold flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  {currentUser.username}
                </div>
                <div className="text-gray-400 text-sm font-mono">
                  {currentUser.walletAddress.slice(0, 6)}...{currentUser.walletAddress.slice(-4)}
                </div>
              </div>

              <button
                onClick={logout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-6 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
