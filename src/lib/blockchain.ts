import { NFTCharacter, Battle, Trade, CharacterType, Rarity } from '../types/game';

export class BlockchainService {
  private static generateHash(): string {
    return '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  static async mintNFT(
    ownerId: string,
    characterType: CharacterType
  ): Promise<{ nft: NFTCharacter; transactionHash: string }> {
    await this.simulateTransaction();

    const rarity = this.generateRarity();
    const stats = this.generateStats(characterType, rarity);
    const tokenId = `TOKEN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const nft: NFTCharacter = {
      id: crypto.randomUUID(),
      tokenId,
      ownerId,
      name: this.generateName(characterType, rarity),
      characterType,
      rarity,
      ...stats,
      level: 1,
      experience: 0,
      imageUrl: this.getCharacterImage(characterType, rarity),
      isListed: false,
      price: 0,
      mintedAt: new Date(),
    };

    return {
      nft,
      transactionHash: this.generateHash(),
    };
  }

  static async executeBattle(
    challengerNft: NFTCharacter,
    opponentNft: NFTCharacter
  ): Promise<{ winnerId: string; battleLog: any[]; transactionHash: string }> {
    await this.simulateTransaction();

    const battleLog = [];
    let challengerHealth = challengerNft.health;
    let opponentHealth = opponentNft.health;
    let round = 1;

    while (challengerHealth > 0 && opponentHealth > 0 && round <= 10) {
      const attacker = challengerNft.speed >= opponentNft.speed
        ? (round % 2 === 1 ? challengerNft : opponentNft)
        : (round % 2 === 1 ? opponentNft : challengerNft);

      const defender = attacker === challengerNft ? opponentNft : challengerNft;

      const damage = Math.max(
        Math.floor(attacker.attack * (1 - defender.defense / 200)),
        5
      );

      if (defender === opponentNft) {
        opponentHealth -= damage;
      } else {
        challengerHealth -= damage;
      }

      battleLog.push({
        round,
        attacker: attacker.name,
        defender: defender.name,
        damage,
        attackerHealth: attacker === challengerNft ? challengerHealth : opponentHealth,
        defenderHealth: defender === challengerNft ? challengerHealth : opponentHealth,
        action: `${attacker.name} attacks ${defender.name} for ${damage} damage!`,
      });

      round++;
    }

    const winnerId = challengerHealth > opponentHealth
      ? challengerNft.ownerId
      : opponentNft.ownerId;

    return {
      winnerId,
      battleLog,
      transactionHash: this.generateHash(),
    };
  }

  static async executeTrade(
    nft: NFTCharacter,
    sellerId: string,
    buyerId: string,
    price: number
  ): Promise<{ transactionHash: string }> {
    await this.simulateTransaction();

    return {
      transactionHash: this.generateHash(),
    };
  }

  private static async simulateTransaction(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  }

  private static generateRarity(): Rarity {
    const rand = Math.random();
    if (rand < 0.05) return 'legendary';
    if (rand < 0.20) return 'epic';
    if (rand < 0.45) return 'rare';
    return 'common';
  }

  private static generateStats(type: CharacterType, rarity: Rarity) {
    const baseStats = {
      warrior: { attack: 80, defense: 90, speed: 50, health: 120 },
      mage: { attack: 100, defense: 50, speed: 70, health: 80 },
      archer: { attack: 85, defense: 60, speed: 95, health: 85 },
      assassin: { attack: 95, defense: 55, speed: 100, health: 75 },
    };

    const multipliers = {
      common: 1.0,
      rare: 1.2,
      epic: 1.5,
      legendary: 2.0,
    };

    const base = baseStats[type];
    const mult = multipliers[rarity];

    return {
      attack: Math.floor(base.attack * mult),
      defense: Math.floor(base.defense * mult),
      speed: Math.floor(base.speed * mult),
      health: Math.floor(base.health * mult),
    };
  }

  private static generateName(type: CharacterType, rarity: Rarity): string {
    const prefixes = {
      legendary: ['Divine', 'Eternal', 'Supreme', 'Celestial'],
      epic: ['Mighty', 'Grand', 'Elite', 'Superior'],
      rare: ['Brave', 'Noble', 'Swift', 'Strong'],
      common: ['Common', 'Basic', 'Simple', 'Regular'],
    };

    const names = {
      warrior: ['Knight', 'Champion', 'Guardian', 'Defender'],
      mage: ['Sorcerer', 'Wizard', 'Enchanter', 'Mystic'],
      archer: ['Ranger', 'Hunter', 'Marksman', 'Scout'],
      assassin: ['Shadow', 'Rogue', 'Blade', 'Phantom'],
    };

    const prefix = prefixes[rarity][Math.floor(Math.random() * prefixes[rarity].length)];
    const name = names[type][Math.floor(Math.random() * names[type].length)];

    return `${prefix} ${name}`;
  }

  private static getCharacterImage(type: CharacterType, rarity: Rarity): string {
    const colors = {
      common: '808080',
      rare: '4169E1',
      epic: '9370DB',
      legendary: 'FFD700',
    };

    const icons = {
      warrior: '⚔️',
      mage: '🔮',
      archer: '🏹',
      assassin: '🗡️',
    };

    return `https://via.placeholder.com/400x400/${colors[rarity]}/FFFFFF?text=${icons[type]}`;
  }
}
