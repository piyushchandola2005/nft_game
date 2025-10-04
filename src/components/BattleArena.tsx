import React, { useState } from 'react';
import { Swords, Loader, Trophy } from 'lucide-react';
import { NFTCard } from './NFTCard';
import { BlockchainService } from '../lib/blockchain';
import { gameStore } from '../lib/gameStore';
import { useGame } from '../contexts/GameContext';
import { NFTCharacter } from '../types/game';

export const BattleArena: React.FC = () => {
  const { currentUser, userNFTs, refreshData } = useGame();
  const [selectedNFT, setSelectedNFT] = useState<NFTCharacter | null>(null);
  const [opponentNFT, setOpponentNFT] = useState<NFTCharacter | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<any>(null);

  const allNFTs = gameStore.getAllNFTs();
  const opponentNFTs = allNFTs.filter(nft => nft.ownerId !== currentUser?.id);

  const handleBattle = async () => {
    if (!currentUser || !selectedNFT || !opponentNFT) return;

    setIsBattling(true);
    setBattleResult(null);

    try {
      const result = await BlockchainService.executeBattle(selectedNFT, opponentNFT);

      const battle = {
        id: crypto.randomUUID(),
        battleId: `BATTLE_${Date.now()}`,
        challengerId: currentUser.id,
        opponentId: opponentNFT.ownerId,
        challengerNftId: selectedNFT.id,
        opponentNftId: opponentNFT.id,
        winnerId: result.winnerId,
        transactionHash: result.transactionHash,
        battleLog: result.battleLog,
        rewards: {
          experience: 100,
          winner: result.winnerId,
        },
        status: 'completed' as const,
        createdAt: new Date(),
        completedAt: new Date(),
      };

      gameStore.addBattle(battle);

      const isWinner = result.winnerId === currentUser.id;
      gameStore.updateProfile(currentUser.id, {
        totalBattles: currentUser.totalBattles + 1,
        wins: isWinner ? currentUser.wins + 1 : currentUser.wins,
      });

      if (isWinner) {
        gameStore.updateNFT(selectedNFT.id, {
          experience: selectedNFT.experience + 100,
          level: Math.floor((selectedNFT.experience + 100) / 100) + 1,
        });
      }

      setBattleResult({
        ...result,
        isWinner,
      });

      refreshData();
    } catch (error) {
      console.error('Battle failed:', error);
    } finally {
      setIsBattling(false);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">Battle Arena</h2>
          <p className="text-gray-400 text-xl">
            Challenge others and prove your warrior's strength
          </p>
        </div>

        {!currentUser ? (
          <div className="text-center text-gray-400 py-12">
            <Swords className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">Connect your wallet to enter the arena</p>
          </div>
        ) : userNFTs.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Swords className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">Mint your first NFT to start battling</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Select Your Warrior</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userNFTs.map(nft => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    onSelect={setSelectedNFT}
                    isSelected={selectedNFT?.id === nft.id}
                  />
                ))}
              </div>
            </div>

            {selectedNFT && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Choose Your Opponent</h3>
                {opponentNFTs.length === 0 ? (
                  <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-xl">
                    <p className="text-xl">No opponents available yet</p>
                    <p className="text-sm mt-2">Other players need to mint NFTs first</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {opponentNFTs.slice(0, 8).map(nft => (
                      <NFTCard
                        key={nft.id}
                        nft={nft}
                        onSelect={setOpponentNFT}
                        isSelected={opponentNFT?.id === nft.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedNFT && opponentNFT && (
              <div className="text-center">
                <button
                  onClick={handleBattle}
                  disabled={isBattling}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-12 rounded-lg text-lg shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-3"
                >
                  {isBattling ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      Battle in Progress...
                    </>
                  ) : (
                    <>
                      <Swords className="w-6 h-6" />
                      Start Battle
                    </>
                  )}
                </button>
              </div>
            )}

            {battleResult && (
              <div
                className={`border-2 rounded-xl p-6 ${
                  battleResult.isWinner
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-red-500/20 border-red-500'
                }`}
              >
                <div className="text-center mb-6">
                  {battleResult.isWinner ? (
                    <>
                      <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-3xl font-bold text-white mb-2">Victory! 🎉</h3>
                      <p className="text-gray-300">
                        {selectedNFT?.name} defeated {opponentNFT?.name}
                      </p>
                      <p className="text-green-400 mt-2">+100 Experience</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-3xl font-bold text-white mb-2">Defeat</h3>
                      <p className="text-gray-300">
                        {opponentNFT?.name} defeated {selectedNFT?.name}
                      </p>
                      <p className="text-gray-400 mt-2">Better luck next time!</p>
                    </>
                  )}
                </div>

                <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <h4 className="text-white font-bold mb-3">Battle Log</h4>
                  <div className="space-y-2">
                    {battleResult.battleLog.map((log: any, index: number) => (
                      <div key={index} className="text-sm text-gray-300 border-b border-gray-800 pb-2">
                        <span className="text-cyan-400">Round {log.round}:</span> {log.action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
