import React, { useState } from 'react';
import { X, Wallet } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, walletAddress: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && walletAddress) {
      onLogin(username, walletAddress);
      onClose();
      setUsername('');
      setWalletAddress('');
    }
  };

  const generateWallet = () => {
    const wallet = '0x' + Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setWalletAddress(wallet);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Connect Wallet</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
              required
            />
            <button
              type="button"
              onClick={generateWallet}
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Generate Random Wallet
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/30"
          >
            Connect & Play
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          Your wallet connects you to the on-chain gaming world
        </p>
      </div>
    </div>
  );
};
