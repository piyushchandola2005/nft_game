import { NFTCharacter, Battle, Trade, Profile, MarketplaceListing } from '../types/game';

class GameStore {
  private profiles: Map<string, Profile> = new Map();
  private nfts: Map<string, NFTCharacter> = new Map();
  private battles: Map<string, Battle> = new Map();
  private trades: Map<string, Trade> = new Map();
  private listings: Map<string, MarketplaceListing> = new Map();
  private currentUserId: string | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const data = localStorage.getItem('gameStore');
    if (data) {
      const parsed = JSON.parse(data);
      this.profiles = new Map(parsed.profiles || []);
      this.nfts = new Map(parsed.nfts || []);
      this.battles = new Map(parsed.battles || []);
      this.trades = new Map(parsed.trades || []);
      this.listings = new Map(parsed.listings || []);
      this.currentUserId = parsed.currentUserId;
    }
  }

  private saveToStorage() {
    const data = {
      profiles: Array.from(this.profiles.entries()),
      nfts: Array.from(this.nfts.entries()),
      battles: Array.from(this.battles.entries()),
      trades: Array.from(this.trades.entries()),
      listings: Array.from(this.listings.entries()),
      currentUserId: this.currentUserId,
    };
    localStorage.setItem('gameStore', JSON.stringify(data));
  }

  setCurrentUser(userId: string) {
    this.currentUserId = userId;
    this.saveToStorage();
  }

  getCurrentUser(): Profile | null {
    if (!this.currentUserId) return null;
    return this.profiles.get(this.currentUserId) || null;
  }

  createProfile(profile: Profile) {
    this.profiles.set(profile.id, profile);
    this.saveToStorage();
  }

  getProfile(id: string): Profile | null {
    return this.profiles.get(id) || null;
  }

  getAllProfiles(): Profile[] {
    return Array.from(this.profiles.values());
  }

  updateProfile(id: string, updates: Partial<Profile>) {
    const profile = this.profiles.get(id);
    if (profile) {
      this.profiles.set(id, { ...profile, ...updates });
      this.saveToStorage();
    }
  }

  addNFT(nft: NFTCharacter) {
    this.nfts.set(nft.id, nft);
    this.saveToStorage();
  }

  getNFT(id: string): NFTCharacter | null {
    return this.nfts.get(id) || null;
  }

  getUserNFTs(userId: string): NFTCharacter[] {
    return Array.from(this.nfts.values()).filter(nft => nft.ownerId === userId);
  }

  getAllNFTs(): NFTCharacter[] {
    return Array.from(this.nfts.values());
  }

  updateNFT(id: string, updates: Partial<NFTCharacter>) {
    const nft = this.nfts.get(id);
    if (nft) {
      this.nfts.set(id, { ...nft, ...updates });
      this.saveToStorage();
    }
  }

  transferNFT(nftId: string, newOwnerId: string) {
    this.updateNFT(nftId, { ownerId: newOwnerId, isListed: false, price: 0 });
  }

  addBattle(battle: Battle) {
    this.battles.set(battle.id, battle);
    this.saveToStorage();
  }

  getBattle(id: string): Battle | null {
    return this.battles.get(id) || null;
  }

  getUserBattles(userId: string): Battle[] {
    return Array.from(this.battles.values()).filter(
      battle => battle.challengerId === userId || battle.opponentId === userId
    );
  }

  getAllBattles(): Battle[] {
    return Array.from(this.battles.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  updateBattle(id: string, updates: Partial<Battle>) {
    const battle = this.battles.get(id);
    if (battle) {
      this.battles.set(id, { ...battle, ...updates });
      this.saveToStorage();
    }
  }

  addTrade(trade: Trade) {
    this.trades.set(trade.id, trade);
    this.saveToStorage();
  }

  getTrade(id: string): Trade | null {
    return this.trades.get(id) || null;
  }

  getAllTrades(): Trade[] {
    return Array.from(this.trades.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  updateTrade(id: string, updates: Partial<Trade>) {
    const trade = this.trades.get(id);
    if (trade) {
      this.trades.set(id, { ...trade, ...updates });
      this.saveToStorage();
    }
  }

  addListing(listing: MarketplaceListing) {
    this.listings.set(listing.id, listing);
    this.saveToStorage();
  }

  getListing(id: string): MarketplaceListing | null {
    return this.listings.get(id) || null;
  }

  getActiveListings(): MarketplaceListing[] {
    return Array.from(this.listings.values())
      .filter(listing => listing.status === 'active')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  updateListing(id: string, updates: Partial<MarketplaceListing>) {
    const listing = this.listings.get(id);
    if (listing) {
      this.listings.set(id, { ...listing, ...updates });
      this.saveToStorage();
    }
  }

  clear() {
    this.profiles.clear();
    this.nfts.clear();
    this.battles.clear();
    this.trades.clear();
    this.listings.clear();
    this.currentUserId = null;
    localStorage.removeItem('gameStore');
  }
}

export const gameStore = new GameStore();
