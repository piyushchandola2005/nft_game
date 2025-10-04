import React from 'react';
import { Package } from 'lucide-react';
import { NFTCard } from './NFTCard';
import { useGame } from '../contexts/GameContext';

export const Inventory: React.FC = () => {
  const { currentUser, userNFTs } = useGame();

  if (!currentUser) {
    return (
      <div className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-400 py-12">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">Connect your wallet to view your inventory</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">My Warriors</h2>
          <p className="text-gray-400 text-xl">
            Your collection of NFT warriors
          </p>
        </div>

        {userNFTs.length === 0 ? (
          <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-xl">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl mb-2">Your inventory is empty</p>
            <p className="text-sm">Mint your first NFT to get started</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-400">{userNFTs.length}</div>
                  <div className="text-gray-400 mt-1">Total NFTs</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400">
                    {userNFTs.filter(n => n.rarity === 'legendary').length}
                  </div>
                  <div className="text-gray-400 mt-1">Legendary</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400">
                    {currentUser.wins}
                  </div>
                  <div className="text-gray-400 mt-1">Battles Won</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400">
                    {currentUser.totalBattles}
                  </div>
                  <div className="text-gray-400 mt-1">Total Battles</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userNFTs.map(nft => (
                <NFTCard key={nft.id} nft={nft} showPrice />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
