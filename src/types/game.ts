export type CharacterType = 'warrior' | 'mage' | 'archer' | 'assassin';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BattleStatus = 'pending' | 'completed' | 'cancelled';
export type TradeStatus = 'pending' | 'completed' | 'cancelled';

export interface NFTCharacter {
  id: string;
  tokenId: string;
  ownerId: string;
  name: string;
  characterType: CharacterType;
  rarity: Rarity;
  attack: number;
  defense: number;
  speed: number;
  health: number;
  level: number;
  experience: number;
  imageUrl: string;
  isListed: boolean;
  price: number;
  mintedAt: Date;
}

export interface Battle {
  id: string;
  battleId: string;
  challengerId: string;
  opponentId: string;
  challengerNftId: string;
  opponentNftId: string;
  winnerId?: string;
  transactionHash: string;
  battleLog: BattleAction[];
  rewards: BattleRewards;
  status: BattleStatus;
  createdAt: Date;
  completedAt?: Date;
}

export interface BattleAction {
  round: number;
  attacker: string;
  defender: string;
  damage: number;
  attackerHealth: number;
  defenderHealth: number;
  action: string;
}

export interface BattleRewards {
  experience: number;
  winner: string;
}

export interface Trade {
  id: string;
  tradeId: string;
  sellerId: string;
  buyerId?: string;
  nftId: string;
  price: number;
  transactionHash: string;
  status: TradeStatus;
  createdAt: Date;
  completedAt?: Date;
}

export interface Profile {
  id: string;
  username: string;
  walletAddress: string;
  avatarUrl?: string;
  totalBattles: number;
  wins: number;
  createdAt: Date;
}

export interface MarketplaceListing {
  id: string;
  nftId: string;
  sellerId: string;
  price: number;
  status: 'active' | 'sold' | 'cancelled';
  createdAt: Date;
}
