import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, NFTCharacter, Battle, Trade, MarketplaceListing } from '../types/game';
import { gameStore } from '../lib/gameStore';

interface GameContextType {
  currentUser: Profile | null;
  login: (username: string, walletAddress: string) => void;
  logout: () => void;
  userNFTs: NFTCharacter[];
  allBattles: Battle[];
  userBattles: Battle[];
  activeListings: MarketplaceListing[];
  allTrades: Trade[];
  refreshData: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [userNFTs, setUserNFTs] = useState<NFTCharacter[]>([]);
  const [allBattles, setAllBattles] = useState<Battle[]>([]);
  const [userBattles, setUserBattles] = useState<Battle[]>([]);
  const [activeListings, setActiveListings] = useState<MarketplaceListing[]>([]);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);

  const refreshData = () => {
    const user = gameStore.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      setUserNFTs(gameStore.getUserNFTs(user.id));
      setUserBattles(gameStore.getUserBattles(user.id));
    } else {
      setUserNFTs([]);
      setUserBattles([]);
    }

    setAllBattles(gameStore.getAllBattles());
    setActiveListings(gameStore.getActiveListings());
    setAllTrades(gameStore.getAllTrades());
  };

  const login = (username: string, walletAddress: string) => {
    const existingProfiles = gameStore.getAllProfiles();
    let user = existingProfiles.find(
      p => p.username === username || p.walletAddress === walletAddress
    );

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        username,
        walletAddress,
        totalBattles: 0,
        wins: 0,
        createdAt: new Date(),
      };
      gameStore.createProfile(user);
    }

    gameStore.setCurrentUser(user.id);
    refreshData();
  };

  const logout = () => {
    gameStore.setCurrentUser('');
    setCurrentUser(null);
    setUserNFTs([]);
    setUserBattles([]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <GameContext.Provider
      value={{
        currentUser,
        login,
        logout,
        userNFTs,
        allBattles,
        userBattles,
        activeListings,
        allTrades,
        refreshData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
