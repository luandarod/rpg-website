export type RPGSystem = 
  | 'D&D 5e' 
  | 'D&D 3.5' 
  | 'Pathfinder 2e' 
  | 'Tormenta20' 
  | 'Call of Cthulhu' 
  | 'Vampire: Masquerade 5e' 
  | 'Cyberpunk RED' 
  | 'Ordem Paranormal'
  | 'Starfinder'
  | 'GURPS'
  | 'Savage Worlds'
  | 'Shadowrun 6e'
  | 'Mutants & Masterminds'
  | 'City of Mist'
  | 'Mörk Borg';

export interface RPGAttributes {
  [key: string]: number;
}

export interface RPGStats {
  hp: number;
  maxHp: number;
  ac: number;
  speed: string;
  initiative: number;
  [key: string]: any;
}

export interface RPGSkill {
  name: string;
  bonus: number;
  trained: boolean;
}

export interface RPGItem {
  name: string;
  quantity: number;
  description: string;
  weight?: string;
  type?: string;
}

export interface RPGAbility {
  name: string;
  description: string;
  type?: string; // Spell, Feature, Feat, etc.
  level?: number;
}

export interface Character {
  id: string;
  userId: string;
  userName: string;
  systems: string[];
  name: string;
  level: number;
  race: string;
  class: string;
  alignment: string;
  backstory: string;
  personality: string;
  appearance: string;
  attributes: RPGAttributes;
  stats: RPGStats;
  skills: RPGSkill[];
  inventory: RPGItem[];
  abilities: RPGAbility[];
  roll20Macro: string;
  foundryActorJson: string;
  createdAt: string;
  avatarUrl?: string;
  archetype?: string;
  subsystem?: string;
  attributeFocus?: string;
  origin?: string;
  complexity?: string;
}

export interface CampaignNote {
  id: string;
  title: string;
  content: string;
  authorName: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isWhisper: boolean;
  recipientId?: string; // If whisper, who is it for? (GM or specific user)
  isDiceRoll?: boolean;
  diceFormula?: string;
  diceResults?: number[];
  diceTotal?: number;
}

export interface MapMarker {
  id: string;
  label: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  color: string;
  type: 'character' | 'monster' | 'hazard' | 'loot' | 'custom';
}

export interface CampaignMap {
  backgroundUrl: string;
  gridEnabled: boolean;
  markers: MapMarker[];
}

export interface CombatCombatant {
  id: string; // matches Character ID or unique ID for custom/monsters
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  ac: number;
  isMonster: boolean;
}

export interface CombatTracker {
  active: boolean;
  combatants: CombatCombatant[];
  currentTurnIndex: number;
  round: number;
  turnTimeLimit: number; // in seconds, 0 for no limit
}

export interface Campaign {
  id: string;
  name: string;
  gmId: string;
  gmName: string;
  systems: string[];
  code: string; // Invite code
  players: { userId: string; userName: string; characterId?: string }[];
  notes: CampaignNote[];
  messages: ChatMessage[];
  map: CampaignMap;
  combat: CombatTracker;
  createdAt: string;
}

export interface MagicItem {
  id: string;
  name: string;
  system: RPGSystem | 'Generic';
  type: string;
  rarity: string;
  attunement: boolean;
  description: string;
  properties?: string[];
}
