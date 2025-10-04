import React, { useState } from 'react';
import { ShoppingCart, Tag, Loader, CheckCircle } from 'lucide-react';
import { NFTCard } from './NFTCard';
import { BlockchainService } from '../lib/blockchain';
import { gameStore } from '../lib/gameStore';
import { useGame } from '../contexts/GameContext';
import { NFTCharacter } from '../types/game';

export const Marketplace: React.FC = () => {
  const { currentUser, userNFTs, refreshData } = useGame();
  const [selectedNFT, setSelectedNFT] = useState<NFTCharacter | null>(null);
  const [listPrice, setListPrice] = useState('');
  const [isListing, setIsListing] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const activeListings = gameStore.getActiveListings();
  const listedNFTs = activeListings
    .map(listing => gameStore.getNFT(listing.nftId))
    .filter(nft => nft && nft.ownerId !== currentUser?.id);

  const handleListNFT = async () => {
    if (!currentUser || !selectedNFT || !listPrice) return;

    setIsListing(true);

    try {
      const price = parseFloat(listPrice);
      const result = await BlockchainService.executeTrade(
        selectedNFT,
        currentUser.id,
        '',
        price
      );

      gameStore.updateNFT(selectedNFT.id, {
        isListed: true,
        price: price,
      });

      const listing = {
        id: crypto.randomUUID(),
        nftId: selectedNFT.id,
        sellerId: currentUser.id,
        price: price,
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      gameStore.addListing(listing);

      const trade = {
        id: crypto.randomUUID(),
        tradeId: `TRADE_${Date.now()}`,
        sellerId: currentUser.id,
        nftId: selectedNFT.id,
        price: price,
        transactionHash: result.transactionHash,
        status: 'pending' as const,
        createdAt: new Date(),
      };

      gameStore.addTrade(trade);

      setSuccessMessage(`${selectedNFT.name} listed for ${price} ETH`);
      setTimeout(() => setSuccessMessage(''), 3000);

      setShowListModal(false);
      setListPrice('');
      setSelectedNFT(null);
      refreshData();
    } catch (error) {
      console.error('Listing failed:', error);
    } finally {
      setIsListing(false);
    }
  };

  const handleBuyNFT = async (nft: NFTCharacter) => {
    if (!currentUser) return;

    setIsBuying(true);

    try {
      const result = await BlockchainService.executeTrade(
        nft,
        nft.ownerId,
        currentUser.id,
        nft.price
      );

      gameStore.transferNFT(nft.id, currentUser.id);

      const listings = gameStore.getActiveListings();
      const listing = listings.find(l => l.nftId === nft.id);
      if (listing) {
        gameStore.updateListing(listing.id, { status: 'sold', updatedAt: new Date() });
      }

      const trades = gameStore.getAllTrades();
      const trade = trades.find(t => t.nftId === nft.id && t.status === 'pending');
      if (trade) {
        gameStore.updateTrade(trade.id, {
          buyerId: currentUser.id,
          status: 'completed',
          completedAt: new Date(),
        });
      }

      setSuccessMessage(`Successfully purchased ${nft.name}!`);
      setTimeout(() => setSuccessMessage(''), 3000);

      refreshData();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">NFT Marketplace</h2>
          <p className="text-gray-400 text-xl">
            Trade warriors with other players on the blockchain
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500 rounded-xl p-4 text-center animate-pulse">
            <CheckCircle className="w-6 h-6 text-green-400 inline-block mr-2" />
            <span className="text-white font-bold">{successMessage}</span>
          </div>
        )}

        {currentUser && userNFTs.length > 0 && (
          <div className="mb-12">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Tag className="w-6 h-6 text-cyan-400" />
                List Your NFT
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                {userNFTs.filter(nft => !nft.isListed).map(nft => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    onSelect={() => {
                      setSelectedNFT(nft);
                      setShowListModal(true);
                    }}
                  />
                ))}
              </div>

              {userNFTs.filter(nft => !nft.isListed).length === 0 && (
                <p className="text-gray-400 text-center py-8">
                  All your NFTs are currently listed
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-cyan-400" />
            Available NFTs
          </h3>

          {listedNFTs.length === 0 ? (
            <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-xl">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No NFTs listed for sale yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {listedNFTs.map(nft => (
                nft && (
                  <div key={nft.id} className="relative">
                    <NFTCard nft={nft} showPrice />
                    <button
                      onClick={() => handleBuyNFT(nft)}
                      disabled={!currentUser || isBuying}
                      className="mt-4 w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBuying ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader className="w-5 h-5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Buy for ${nft.price} ETH`
                      )}
                    </button>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {showListModal && selectedNFT && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">List NFT for Sale</h3>

            <div className="mb-6">
              <NFTCard nft={selectedNFT} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">Price (ETH)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowListModal(false);
                  setListPrice('');
                  setSelectedNFT(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleListNFT}
                disabled={isListing || !listPrice}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isListing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Listing...
                  </span>
                ) : (
                  'List NFT'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
