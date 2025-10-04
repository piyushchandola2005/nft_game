import React, { useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';
import { CharacterType } from '../types/game';
import { BlockchainService } from '../lib/blockchain';
import { gameStore } from '../lib/gameStore';
import { useGame } from '../contexts/GameContext';

export const MintSection: React.FC = () => {
  const { currentUser, refreshData } = useGame();
  const [selectedType, setSelectedType] = useState<CharacterType>('warrior');
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<any>(null);

  const characterTypes: { type: CharacterType; icon: string; description: string }[] = [
    { type: 'warrior', icon: '⚔️', description: 'High defense, balanced stats' },
    { type: 'mage', icon: '🔮', description: 'Powerful attacks, low defense' },
    { type: 'archer', icon: '🏹', description: 'Fast and deadly from range' },
    { type: 'assassin', icon: '🗡️', description: 'Maximum speed and critical hits' },
  ];

  const handleMint = async () => {
    if (!currentUser) return;

    setIsMinting(true);
    setMintedNFT(null);

    try {
      const result = await BlockchainService.mintNFT(currentUser.id, selectedType);
      gameStore.addNFT(result.nft);
      setMintedNFT(result.nft);
      refreshData();

      setTimeout(() => setMintedNFT(null), 5000);
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">Mint Your Warrior</h2>
          <p className="text-gray-400 text-xl">
            Create a unique NFT character to begin your journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {characterTypes.map(({ type, icon, description }) => (
            <div
              key={type}
              onClick={() => setSelectedType(type)}
              className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedType === type
                  ? 'border-cyan-500 shadow-lg shadow-cyan-500/50'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-6xl mb-4 text-center">{icon}</div>
              <h3 className="text-white font-bold text-xl mb-2 capitalize text-center">
                {type}
              </h3>
              <p className="text-gray-400 text-sm text-center">{description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleMint}
            disabled={isMinting || !currentUser}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-lg text-lg shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-3"
          >
            {isMinting ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                Minting on Chain...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Mint NFT (0.01 ETH)
              </>
            )}
          </button>

          {!currentUser && (
            <p className="text-red-400 mt-4">Please connect your wallet to mint</p>
          )}
        </div>

        {mintedNFT && (
          <div className="mt-8 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500 rounded-xl p-6 text-center animate-pulse">
            <h3 className="text-2xl font-bold text-white mb-2">
              Successfully Minted! 🎉
            </h3>
            <p className="text-gray-300">
              <span className="text-green-400 font-bold">{mintedNFT.name}</span> has been
              added to your collection
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
