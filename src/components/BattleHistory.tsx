import React from 'react';
import { Clock, Trophy, ExternalLink } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { gameStore } from '../lib/gameStore';

export const BattleHistory: React.FC = () => {
  const { allBattles, currentUser } = useGame();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">Battle History</h2>
          <p className="text-gray-400 text-xl">
            Recent battles recorded on the blockchain
          </p>
        </div>

        {allBattles.length === 0 ? (
          <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-xl">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No battles recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allBattles.map(battle => {
              const challengerProfile = gameStore.getProfile(battle.challengerId);
              const opponentProfile = gameStore.getProfile(battle.opponentId);
              const challengerNFT = gameStore.getNFT(battle.challengerNftId);
              const opponentNFT = gameStore.getNFT(battle.opponentNftId);
              const isWinner = currentUser && battle.winnerId === currentUser.id;

              return (
                <div
                  key={battle.id}
                  className={`bg-gray-800 border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
                    isWinner
                      ? 'border-green-500 hover:shadow-green-500/20'
                      : currentUser && (battle.challengerId === currentUser.id || battle.opponentId === currentUser.id)
                      ? 'border-red-500 hover:shadow-red-500/20'
                      : 'border-gray-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {battle.winnerId === battle.challengerId ? (
                          <Trophy className="w-5 h-5 text-yellow-400" />
                        ) : null}
                        <div>
                          <div className="text-white font-bold">
                            {challengerNFT?.name || 'Unknown'}
                            <span className="text-gray-400 font-normal text-sm ml-2">
                              ({challengerProfile?.username || 'Unknown'})
                            </span>
                          </div>
                          <div className="text-gray-500 text-sm">
                            Level {challengerNFT?.level || 1} {challengerNFT?.characterType || 'Warrior'}
                          </div>
                        </div>
                      </div>

                      <div className="text-cyan-400 font-bold text-center my-2">VS</div>

                      <div className="flex items-center gap-3">
                        {battle.winnerId === battle.opponentId ? (
                          <Trophy className="w-5 h-5 text-yellow-400" />
                        ) : null}
                        <div>
                          <div className="text-white font-bold">
                            {opponentNFT?.name || 'Unknown'}
                            <span className="text-gray-400 font-normal text-sm ml-2">
                              ({opponentProfile?.username || 'Unknown'})
                            </span>
                          </div>
                          <div className="text-gray-500 text-sm">
                            Level {opponentNFT?.level || 1} {opponentNFT?.characterType || 'Warrior'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-gray-400 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDate(battle.createdAt)}
                      </div>

                      <a
                        href={`https://etherscan.io/tx/${battle.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Chain
                      </a>

                      {isWinner && (
                        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                          Victory +{battle.rewards.experience} XP
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
