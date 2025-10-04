import React from 'react';
import { NFTCharacter } from '../types/game';
import { Sword, Shield, Zap, Heart } from 'lucide-react';

interface NFTCardProps {
  nft: NFTCharacter;
  onSelect?: (nft: NFTCharacter) => void;
  isSelected?: boolean;
  showPrice?: boolean;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, onSelect, isSelected, showPrice }) => {
  const rarityColors = {
    common: 'from-gray-600 to-gray-700',
    rare: 'from-blue-600 to-blue-700',
    epic: 'from-purple-600 to-purple-700',
    legendary: 'from-yellow-500 to-yellow-600',
  };

  const rarityBorders = {
    common: 'border-gray-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500',
  };

  const rarityGlow = {
    common: 'shadow-gray-500/20',
    rare: 'shadow-blue-500/40',
    epic: 'shadow-purple-500/40',
    legendary: 'shadow-yellow-500/60',
  };

  return (
    <div
      onClick={() => onSelect?.(nft)}
      className={`bg-gray-800 border-2 ${rarityBorders[nft.rarity]} rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl ${rarityGlow[nft.rarity]} ${
        isSelected ? 'ring-4 ring-cyan-400 scale-105' : ''
      }`}
    >
      <div className={`h-3 bg-gradient-to-r ${rarityColors[nft.rarity]}`} />

      <div className="p-4">
        <div className="aspect-square bg-gray-900 rounded-lg mb-4 flex items-center justify-center text-6xl">
          {nft.characterType === 'warrior' && '⚔️'}
          {nft.characterType === 'mage' && '🔮'}
          {nft.characterType === 'archer' && '🏹'}
          {nft.characterType === 'assassin' && '🗡️'}
        </div>

        <div className="mb-3">
          <h3 className="text-white font-bold text-lg mb-1">{nft.name}</h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
              nft.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
              nft.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
              nft.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {nft.rarity}
            </span>
            <span className="text-gray-400 text-sm capitalize">{nft.characterType}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-900 rounded-lg p-2 flex items-center gap-2">
            <Sword className="w-4 h-4 text-red-400" />
            <div>
              <div className="text-xs text-gray-400">Attack</div>
              <div className="text-white font-bold">{nft.attack}</div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-xs text-gray-400">Defense</div>
              <div className="text-white font-bold">{nft.defense}</div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <div>
              <div className="text-xs text-gray-400">Speed</div>
              <div className="text-white font-bold">{nft.speed}</div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-green-400" />
            <div>
              <div className="text-xs text-gray-400">Health</div>
              <div className="text-white font-bold">{nft.health}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Level {nft.level}</span>
          <span className="text-gray-500 text-xs font-mono">#{nft.tokenId.slice(-8)}</span>
        </div>

        {showPrice && nft.isListed && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">Listed for</div>
              <div className="text-cyan-400 font-bold text-lg">{nft.price} ETH</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
