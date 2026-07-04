import React, { useState, useEffect } from 'react';
import { Character, Campaign, ChatMessage, CampaignMap, CombatTracker, RPGSystem, CampaignNote } from './types';
import CharacterSheetView from './components/CharacterSheetView';
import MapBoard from './components/MapBoard';
import ChatPanel from './components/ChatPanel';
import CombatTrackerComponent from './components/CombatTracker';
import MagicItemsDb from './components/MagicItemsDb';
import GMTools from './components/GMTools';
import BestiaryDb from './components/BestiaryDb';
import { 
  Sparkles, Shield, User, Scroll, FileText, Compass, Volume2, VolumeX, 
  Clock, Share2, Plus, Users, LayoutDashboard, Copy, Check, MessageSquare, 
  Map, Swords, HelpCircle, Save, Wifi, WifiOff, RefreshCw, Printer, Trash2, Wrench, Skull
} from 'lucide-react';

// Web Audio API Synthesizer for Atmospheric Loops
class RPGAmbientSynth {
  private ctx: AudioContext | null = null;
  private nodes: AudioNode[] = [];
  private activeTheme: string | null = null;
  private isMuted: boolean = false;

  start(theme: string) {
    this.stop();
    this.activeTheme = theme;
    if (this.isMuted) return;

    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = this.ctx;

      if (theme === 'Dungeon') {
        // Low rumbling sub drone + space filter
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2
        
        // Modulator for eerie drone movement
        const modulator = ctx.createOscillator();
        const modGain = ctx.createGain();
        modulator.frequency.value = 0.15; // very slow
        modGain.gain.value = 15; // modulate filter cutoff by 15hz
        
        filter.type = 'lowpass';
        filter.Q.value = 5;
        filter.frequency.setValueAtTime(220, ctx.currentTime);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);

        modulator.connect(modGain);
        modGain.connect(filter.frequency);
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        modulator.start();

        this.nodes = [osc1, osc2, modulator, filter, gain];
      } else if (theme === 'Tavern') {
        // Crackling fireplace sound synthesis (brown noise modulated + gentle chimes)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Brown noise formula
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Gain compensation
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 600;

        // Modulate gain slowly for crackle effect
        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();
        mod.type = 'sine';
        mod.frequency.value = 4.0;
        modGain.gain.value = 0.2;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.08;

        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noiseNode.start();
        this.nodes = [noiseNode, filter, gainNode];
      } else if (theme === 'Forest') {
        // Modulated white noise for gentle wind chimes + rustle
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        // Modulate wind cutoff to make it blow in gusts
        const windMod = ctx.createOscillator();
        const windModGain = ctx.createGain();
        windMod.frequency.value = 0.08;
        windModGain.gain.value = 350;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.05;

        windMod.connect(windModGain);
        windModGain.connect(filter.frequency);
        
        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        windMod.start();
        noiseNode.start();
        this.nodes = [noiseNode, windMod, filter, gainNode];
      } else if (theme === 'Battle') {
        // Heavy drum beats synthesized at low frequency repeating
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, ctx.currentTime);
        
        // LFO for periodic drum strike simulation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'square';
        lfo.frequency.value = 1.25; // tempo
        lfoGain.gain.value = 40; // modulate pitch down on hit

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        lfo.start();
        this.nodes = [osc, lfo, gainNode];
      }
    } catch (e) {
      console.warn('Audio Context fail:', e);
    }
  }

  stop() {
    this.nodes.forEach(node => {
      try {
        (node as any).stop();
      } catch (e) {}
    });
    this.nodes = [];
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.activeTheme = null;
  }

  mute() {
    this.isMuted = true;
    this.stop();
  }

  unmute() {
    this.isMuted = false;
    if (this.activeTheme) {
      this.start(this.activeTheme);
    }
  }

  getIsMuted() {
    return this.isMuted;
  }

  getActiveTheme() {
    return this.activeTheme;
  }
}

const ambientSynth = new RPGAmbientSynth();

const SYSTEM_VERSIONS: Record<string, string[]> = {
  'D&D 5e': ['D&D 5e (2024 Remaster)', 'D&D 5e (2014 Original)', 'Critical Role: Tal\'Dorei', 'Critical Role: Wildemount', 'Hardcore 5e'],
  'D&D 3.5': ['Clássico 3.5', 'Pathfinder 1e (3.75)', 'Eberron', 'Forgotten Realms'],
  'Pathfinder 2e': ['Remaster (2023)', 'Legacy (2019)', 'Free Archetype Rule', 'Lost Omens', 'Kingmaker'],
  'Tormenta20': ['Jogo do Ano (JdA)', 'Versão Original (2020)', 'Ameaças de Arton', 'Atlas de Arton'],
  'Call of Cthulhu': ['7ª Edição (Percentil)', 'Pulp Cthulhu (Heroico)', 'Gaslight', 'Modern'],
  'Vampire: Masquerade 5e': ['V5 Clássico', 'Vampire Dark Ages V5', 'Blood Sigil', 'Chicago By Night'],
  'Cyberpunk RED': ['Cyberpunk RED (Padrão)', 'Cyberpunk 2077 (Futurista)', 'Black Chrome', 'Tales of the RED'],
  'Ordem Paranormal': ['Regras Oficiais v1.2', 'Sobrevivência Sobrenatural', 'O Segredo na Ilha', 'Calamidade'],
  'Starfinder': ['Starfinder 1e', 'Starfinder 2e (Playtest)', 'Pact Worlds', 'Armory'],
  'GURPS': ['GURPS 4e', 'GURPS Lite', 'GURPS Fantasy', 'GURPS Space'],
  'Savage Worlds': ['SWADE (Adventure Edition)', 'Deadlands', 'Pathfinder for Savage Worlds', 'Rifts'],
  'Shadowrun 6e': ['Sixth World', 'Shadowrun 5e', 'Street Wyrd', 'Firing Squad'],
  'Mutants & Masterminds': ['M&M 3e', 'DC Adventures', 'Power Profiles', 'Gadget Guides'],
  'City of Mist': ['Core Rules', 'Tokyo: Otherscape', 'Shadows & Showdowns', 'Nights of Payne Town'],
  'Mörk Borg': ['Mörk Borg (Core)', 'Cy_Borg', 'Pirate Borg', 'Death in Space']
};

const getArchetypePlaceholder = (sys: string) => {
  switch(sys) {
    case 'D&D 5e': return 'Ex: Necromante Sombrio, Bárbaro do Totem';
    case 'D&D 3.5': return 'Ex: Atirador de Elite, Teurgista Místico';
    case 'Pathfinder 2e': return 'Ex: Alquimista Mutagênico, Caçador de Monstros';
    case 'Tormenta20': return 'Ex: Cavaleiro da Ordem, Paladino de Khalmyr';
    case 'Call of Cthulhu': return 'Ex: Professor de Arqueologia, Detetive Ocultista';
    case 'Vampire: Masquerade 5e': return 'Ex: Diplomata Ventrue, Carniceiro Brujah';
    case 'Cyberpunk RED': return 'Ex: Netrunner Rebelde, Mercenário Solo';
    case 'Ordem Paranormal': return 'Ex: Ocultista Flagelador, Combatente de Elite';
    case 'Starfinder': return 'Ex: Operativo Fantasma, Tecnauta de Combate';
    case 'GURPS': return 'Ex: Especialista Tático, Psiónico Renegado';
    case 'Savage Worlds': return 'Ex: Pistoleiro Arcano, Piloto Ás';
    case 'Shadowrun 6e': return 'Ex: Xamã das Ruas, Rigger de Drones';
    case 'Mutants & Masterminds': return 'Ex: Velocista Cósmico, Mago Místico';
    case 'City of Mist': return 'Ex: Avatar do Rei Arthur, Fada Detetive';
    case 'Mörk Borg': return 'Ex: Ocultista Miséria, Mercenário Condenado';
    default: return 'Ex: Arqueiro Ágil, Cavaleiro Honrado';
  }
};

const getOriginPlaceholder = (sys: string) => {
  switch(sys) {
    case 'D&D 5e': return 'Ex: Nobre Exilado, Órfão de Guilda';
    case 'D&D 3.5': return 'Ex: Ermitão Solitário, Acólito de Templo';
    case 'Pathfinder 2e': return 'Ex: Mercador Ambulante, Acadêmico da Magia';
    case 'Tormenta20': return 'Ex: Sobrevivente da Área de Tormenta, Gladiador';
    case 'Call of Cthulhu': return 'Ex: Veterano da Grande Guerra, Sobrevivente de Seita';
    case 'Vampire: Masquerade 5e': return 'Ex: Herdeiro de Mansão, Garoto de Rua Sobrevivente';
    case 'Cyberpunk RED': return 'Ex: Garoto de Rua de Night City, Ex-Corporativo';
    case 'Ordem Paranormal': return 'Ex: Ex-Investigador Civil, Jovem Universitário';
    default: return 'Ex: Aventureiro Local, Viajante Solitário';
  }
};

export default function App() {
  // Navigation / Tab States
  const [activeTab, setActiveTab] = useState<'generator' | 'my-characters' | 'campaigns' | 'magic-items' | 'tools' | 'bestiary'>('generator');
  
  // User Identity States (picked by user)
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('rpg_user_name') || 'Herói Anônimo');
  const [userId] = useState<string>(() => {
    let id = localStorage.getItem('rpg_user_id');
    if (!id) {
      id = 'user-' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('rpg_user_id', id);
    }
    return id;
  });
  const [isGm, setIsGm] = useState<boolean>(() => localStorage.getItem('rpg_is_gm') === 'true');

  // Generator input states
  const [selectedSystems, setSelectedSystems] = useState<string[]>(['D&D 5e']);
  const [characterConcept, setCharacterConcept] = useState('');
  const [characterLevel, setCharacterLevel] = useState<number>(1);
  const [characterTraits, setCharacterTraits] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState<Character | null>(null);

  // Advanced customization states
  const [characterArchetype, setCharacterArchetype] = useState('');
  const [characterSubsystem, setCharacterSubsystem] = useState('D&D 5e (2024 Remaster)');
  const [characterAttrFocus, setCharacterAttrFocus] = useState('Equilibrado');
  const [characterOrigin, setCharacterOrigin] = useState('');
  const [characterComplexity, setCharacterComplexity] = useState('Padrão');

  // Database arrays
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);

  // New Campaign / Join Campaign Form states
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignSystem, setNewCampaignSystem] = useState<RPGSystem>('D&D 5e');
  const [joinCode, setJoinCode] = useState('');
  const [selectedCampaignCharId, setSelectedCampaignCharId] = useState('');

  // Sychronization / Network State
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<string>('');
  const [copiedInviteCode, setCopiedInviteCode] = useState(false);

  // Ambient sound state
  const [soundTheme, setSoundTheme] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Sync username changes to storage
  useEffect(() => {
    localStorage.setItem('rpg_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('rpg_is_gm', String(isGm));
  }, [isGm]);

  // Load characters and campaigns from server (with LocalStorage fallback)
  const syncData = async () => {
    try {
      // 1. Fetch Characters
      const charRes = await fetch('/api/characters');
      if (charRes.ok) {
        const chars = await charRes.json();
        setSavedCharacters(chars);
        localStorage.setItem('fallback_characters', JSON.stringify(chars));
      }

      // 2. Fetch Campaigns
      const campRes = await fetch('/api/campaigns');
      if (campRes.ok) {
        const camps = await campRes.json();
        setCampaigns(camps);
        localStorage.setItem('fallback_campaigns', JSON.stringify(camps));

        // Sync active campaign if one is selected
        if (activeCampaign) {
          const currentCamp = camps.find((c: Campaign) => c.id === activeCampaign.id);
          if (currentCamp) {
            setActiveCampaign(currentCamp);
          }
        }
      }

      setIsOnline(true);
      setLastSync(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn("Offline or API failed, using local storage cache:", e);
      setIsOnline(false);

      // Fallbacks
      const cachedChars = localStorage.getItem('fallback_characters');
      if (cachedChars) setSavedCharacters(JSON.parse(cachedChars));

      const cachedCamps = localStorage.getItem('fallback_campaigns');
      if (cachedCamps) setCampaigns(JSON.parse(cachedCamps));
    }
  };

  // Run initial sync & background polling every 4 seconds for Campaign real-time feeling
  useEffect(() => {
    syncData();
    const interval = setInterval(syncData, 4000);
    return () => clearInterval(interval);
  }, [activeCampaign?.id]);

  // Trigger character generator API
  const handleGenerateCharacter = async () => {
    if (!characterConcept.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systems: selectedSystems,
          concept: characterConcept,
          level: characterLevel,
          traits: characterTraits,
          archetype: characterArchetype,
          subsystem: characterSubsystem,
          attributeFocus: characterAttrFocus,
          origin: characterOrigin,
          complexity: characterComplexity
        })
      });

      if (!res.ok) {
        throw new Error('Falha na geração com Inteligência Artificial.');
      }

      const sheet = await res.json();
      
      // Add local ID and metadata
      const finalChar: Character = {
        ...sheet,
        id: 'char-' + Date.now().toString(36),
        userId: userId,
        userName: userName,
        systems: selectedSystems,
        level: characterLevel
      };

      setGeneratedCharacter(finalChar);
      
      // Auto save to server list
      await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalChar)
      });

      syncData();
    } catch (e: any) {
      alert(`Erro na geração: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle quick traits
  const handleToggleTrait = (trait: string) => {
    if (characterTraits.includes(trait)) {
      setCharacterTraits(characterTraits.filter(t => t !== trait));
    } else {
      setCharacterTraits([...characterTraits, trait]);
    }
  };

  // Synchronize system and default sub-version
  const handleSystemChange = (system: string) => {
    if (selectedSystems.includes(system)) {
      if (selectedSystems.length > 1) {
        setSelectedSystems(selectedSystems.filter(s => s !== system));
      }
    } else {
      setSelectedSystems([...selectedSystems, system]);
    }
  };

  // Create campaign
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCampaignName.trim(),
          system: newCampaignSystem,
          gmId: userId,
          gmName: userName
        })
      });

      if (res.ok) {
        setNewCampaignName('');
        syncData();
      }
    } catch (e) {
      alert("Falha ao criar campanha");
    }
  };

  // Join Campaign with code
  const handleJoinCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      const res = await fetch('/api/campaigns/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: joinCode.trim().toUpperCase(),
          userId,
          userName,
          characterId: selectedCampaignCharId || undefined
        })
      });

      if (res.ok) {
        const campaign = await res.json();
        setActiveCampaign(campaign);
        setJoinCode('');
        syncData();
      } else {
        const err = await res.json();
        alert(err.error || "Código inválido");
      }
    } catch (e) {
      alert("Falha ao entrar na campanha");
    }
  };

  // Update Map Board markers/background from client
  const handleUpdateMap = async (newMap: CampaignMap) => {
    if (!activeCampaign) return;

    // Local state change first for snappy feel
    const updated = { ...activeCampaign, map: newMap };
    setActiveCampaign(updated);

    try {
      await fetch(`/api/campaigns/${activeCampaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ map: newMap })
      });
    } catch (e) {
      console.warn("Failed syncing map modifications to cloud database");
    }
  };

  // Update Combat Order from client
  const handleUpdateCombat = async (newCombat: CombatTracker) => {
    if (!activeCampaign) return;

    // Update locally
    const updated = { ...activeCampaign, combat: newCombat };
    setActiveCampaign(updated);

    try {
      await fetch(`/api/campaigns/${activeCampaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ combat: newCombat })
      });
    } catch (e) {
      console.warn("Failed syncing combat tracker to server");
    }
  };

  // Send campaign chat message
  const handleSendMessage = async (text: string, isWhisper: boolean, recipientId?: string) => {
    if (!activeCampaign) return;

    let msg: Partial<ChatMessage> = {
      senderId: userId,
      senderName: userName,
      text,
      isWhisper,
      recipientId
    };

    // Quick regex dice roller parsing
    const diceRegex = /^\/r(oll)?\s+(\d+)d(\d+)([+-]\d+)?/i;
    const match = text.match(diceRegex);
    if (match) {
      const qty = parseInt(match[2]);
      const sides = parseInt(match[3]);
      const mod = match[4] ? parseInt(match[4]) : 0;
      
      const results: number[] = [];
      let total = 0;
      for (let i = 0; i < qty; i++) {
        const r = Math.floor(Math.random() * sides) + 1;
        results.push(r);
        total += r;
      }
      total += mod;

      msg.isDiceRoll = true;
      msg.diceFormula = `${qty}d${sides}${mod >= 0 ? '+' : ''}${mod}`;
      msg.diceResults = results;
      msg.diceTotal = total;
    }

    try {
      const res = await fetch(`/api/campaigns/${activeCampaign.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });

      if (res.ok) {
        const updatedMsgs = await res.json();
        setActiveCampaign({ ...activeCampaign, messages: updatedMsgs });
      }
    } catch (e) {
      console.warn("Failed sending chat message");
    }
  };

  // Create campaign shared note
  const handleAddNote = async (title: string, content: string) => {
    if (!activeCampaign) return;

    try {
      const res = await fetch(`/api/campaigns/${activeCampaign.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          authorName: userName
        })
      });

      if (res.ok) {
        const updatedNotes = await res.json();
        setActiveCampaign({ ...activeCampaign, notes: updatedNotes });
      }
    } catch (e) {
      console.warn("Failed updating campaign note");
    }
  };

  // Delete Campaign Note
  const handleDeleteNote = async (noteId: string) => {
    if (!activeCampaign) return;

    const remaining = activeCampaign.notes.filter(n => n.id !== noteId);
    try {
      const res = await fetch(`/api/campaigns/${activeCampaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: remaining })
      });

      if (res.ok) {
        setActiveCampaign({ ...activeCampaign, notes: remaining });
      }
    } catch (e) {
      console.warn("Failed deleting campaign note");
    }
  };

  // Toggle ambient sounds
  const handleToggleSound = (theme: string) => {
    if (soundTheme === theme) {
      ambientSynth.stop();
      setSoundTheme(null);
    } else {
      ambientSynth.start(theme);
      setSoundTheme(theme);
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    if (nextMute) {
      ambientSynth.mute();
    } else {
      ambientSynth.unmute();
    }
  };

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedInviteCode(true);
    setTimeout(() => setCopiedInviteCode(false), 2000);
  };

  const exportCampaignSummaryPdf = () => {
    if (!activeCampaign) return;
    window.print();
  };

  const PRESET_TRAITS = [
    'Destemido', 'Estrategista', 'Sombrio', 'Sarcástico', 'Honrado', 'Ganancioso', 'Erudito', 'Impulsivo'
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 flex flex-col font-sans selection:bg-white/20 selection:text-white antialiased">
      {/* Top Navigation Header - Modern Glass/Editorial */}
      <header className="no-print bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <Scroll size={16} className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-display font-bold text-white tracking-tight leading-none">A.I. TABLETOP HUB</h1>
              <p className="text-[9px] text-zinc-500 font-mono tracking-widest mt-1 uppercase">v2.0 // Neural Sync</p>
            </div>
          </div>

          {/* Quick Soundscapes controller */}
          <div className="hidden md:flex items-center gap-1 bg-zinc-900/50 p-1 rounded-md border border-white/5">
            <button 
              onClick={handleToggleMute} 
              className="px-2 text-zinc-400 hover:text-white transition cursor-pointer"
              title={isAudioMuted ? "Ativar som" : "Mutar som"}
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-emerald-400" />}
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
            {['Dungeon', 'Tavern', 'Forest', 'Battle'].map((theme) => (
              <button
                key={theme}
                onClick={() => handleToggleSound(theme)}
                className={`px-3 py-1 rounded text-[10px] font-mono tracking-wider transition cursor-pointer uppercase ${
                  soundTheme === theme
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                {theme === 'Dungeon' ? 'Masmorra' : theme === 'Tavern' ? 'Taverna' : theme === 'Forest' ? 'Floresta' : 'Combate'}
              </button>
            ))}
          </div>

          {/* Sync status element */}
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-sm border ${
              isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
              {isOnline ? `SYNC: ${lastSync.split(' ')[0]}` : 'OFFLINE'}
            </span>
          </div>
        </div>
      </header>

      {/* Main container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* User profile setting & Nav (No Print) */}
        <div className="no-print bg-zinc-900/40 border border-white/5 rounded-none p-2 mb-10 flex flex-wrap items-center justify-between gap-4 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => { setActiveTab('generator'); setActiveCampaign(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-display font-bold rounded-sm transition cursor-pointer tracking-wide ${
                activeTab === 'generator' && !activeCampaign
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={14} /> FORJA NEURAL
            </button>
            <button
              onClick={() => { setActiveTab('my-characters'); setActiveCampaign(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-display font-bold rounded-sm transition cursor-pointer tracking-wide ${
                activeTab === 'my-characters' && !activeCampaign
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText size={14} /> ARQUIVOS ({savedCharacters.length})
            </button>
            <button
              onClick={() => { setActiveTab('campaigns'); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-display font-bold rounded-sm transition cursor-pointer tracking-wide ${
                activeTab === 'campaigns' || activeCampaign
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={14} /> MULTIPLAYER ({campaigns.length})
            </button>
            <button
              onClick={() => { setActiveTab('magic-items'); setActiveCampaign(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-display font-bold rounded-sm transition cursor-pointer tracking-wide ${
                activeTab === 'magic-items' && !activeCampaign
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass size={14} /> ARTEFATOS
            </button>
            <button
              onClick={() => { setActiveTab('tools'); setActiveCampaign(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-display font-bold rounded-sm transition cursor-pointer tracking-wide ${
                activeTab === 'tools' && !activeCampaign
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wrench size={14} /> UTILITÁRIOS
            </button>
            <button
              onClick={() => { setActiveTab('bestiary'); setActiveCampaign(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-display font-bold rounded-sm transition cursor-pointer tracking-wide ${
                activeTab === 'bestiary' && !activeCampaign
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Skull size={14} /> BESTIÁRIO
            </button>
          </div>

          <div className="flex items-center gap-3 pr-2 border-l border-white/10 pl-4 py-1">
            <div className="w-8 h-8 rounded bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 font-mono text-xs font-bold">
              {isGm ? 'GM' : 'PL'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-transparent font-display font-bold text-sm text-white focus:outline-none focus:ring-0 w-24 md:w-32 truncate"
                  title="Clique para renomear"
                />
                <button
                  onClick={() => setIsGm(!isGm)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest border cursor-pointer uppercase ${
                    isGm 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isGm ? 'Master' : 'Player'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: AI Prompt Generator */}
        {activeTab === 'generator' && !activeCampaign && (
          <div className="no-print grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Control Panel Column */}
            <div className="xl:col-span-4 space-y-6">
              <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-6 space-y-5 backdrop-blur-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-2 relative">
                  <Sparkles size={18} className="text-zinc-300" />
                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-widest">Forja Neural de Personagens</h2>
                </div>

                {/* SECTION 1: SYSTEM & VERSION */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                    <Shield size={12} />
                    <span>01. Sistema</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(SYSTEM_VERSIONS).map((sys) => {
                        const isSelected = selectedSystems.includes(sys);
                        return (
                          <button
                            type="button"
                            key={sys}
                            onClick={() => handleSystemChange(sys)}
                            className={`px-3 py-1.5 rounded-sm border text-[10px] font-mono tracking-widest uppercase transition cursor-pointer ${
                              isSelected
                                ? 'bg-white/10 border-white text-white font-bold'
                                : 'bg-transparent border-white/10 hover:bg-white/5 text-zinc-500'
                            }`}
                          >
                            {sys}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <select
                      value={characterSubsystem}
                      onChange={(e) => setCharacterSubsystem(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 rounded-sm px-4 py-2.5 text-sm font-medium text-zinc-400 focus:outline-none focus:border-white/30 cursor-pointer appearance-none"
                    >
                      {selectedSystems.flatMap(sys => SYSTEM_VERSIONS[sys] || []).map((ver) => (
                        <option key={ver} value={ver}>{ver}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SECTION 2: ARCHETYPE & STATS FOCUS */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                    <User size={12} />
                    <span>02. Perfil</span>
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder={getArchetypePlaceholder(selectedSystems[0])}
                      value={characterArchetype}
                      onChange={(e) => setCharacterArchetype(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-white/30 placeholder:text-zinc-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Foco de Atributos</label>
                    <select
                      value={characterAttrFocus}
                      onChange={(e) => setCharacterAttrFocus(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Equilibrado">Equilibrado / Padrão</option>
                      <option value="Força / Combate Físico">Força / Combate Físico</option>
                      <option value="Agilidade / Destreza / Reflexos">Agilidade / Destreza / Reflexos</option>
                      <option value="Inteligência / Tecnologia / Saberes">Inteligência / Saberes / Tecnologia</option>
                      <option value="Sabedoria / Presença / Percepção">Sabedoria / Presença / Percepção</option>
                      <option value="Carisma / Relações Sociais">Carisma / Social / Liderança</option>
                      <option value="Poder / Vontade / Sobrenatural">Poder / Vontade / Paranormal</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-1">
                      <span>Nível do Personagem</span>
                      <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">Lvl {characterLevel}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={['Call of Cthulhu', 'Vampire: Masquerade 5e', 'Cyberpunk RED'].includes(selectedSystems[0]) ? '10' : '20'}
                      value={characterLevel}
                      onChange={(e) => setCharacterLevel(parseInt(e.target.value))}
                      className="w-full accent-white cursor-ew-resize h-1 bg-white/10 rounded-sm appearance-none"
                    />
                  </div>
                </div>

                {/* SECTION 3: ORIGIN & PERSONALITY */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                    <Compass size={12} />
                    <span>03. Antecedente</span>
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder={getOriginPlaceholder(selectedSystems[0])}
                      value={characterOrigin}
                      onChange={(e) => setCharacterOrigin(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-white/30 placeholder:text-zinc-600 font-medium"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest block">Traços Rápidos</label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_TRAITS.map(trait => {
                        const selected = characterTraits.includes(trait);
                        return (
                          <button
                            key={trait}
                            onClick={() => handleToggleTrait(trait)}
                            className={`px-3 py-1 rounded-sm text-[10px] font-mono font-bold border transition cursor-pointer uppercase tracking-wider ${
                              selected
                                ? 'bg-white border-white text-black'
                                : 'bg-transparent border-white/10 hover:bg-white/5 text-zinc-400'
                            }`}
                          >
                            {trait}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* SECTION 4: CONCEPT & COMPLEXITY */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                    <FileText size={12} />
                    <span>04. Biografia Neural</span>
                  </div>

                  <div className="space-y-1.5">
                    <textarea
                      placeholder="Descreva visual, história, deuses, objetivos... (Ex: Um elfo caçador buscando vingança contra o dragão...)"
                      value={characterConcept}
                      onChange={(e) => setCharacterConcept(e.target.value)}
                      rows={4}
                      className="w-full bg-zinc-950 border border-white/10 rounded-sm px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-white/30 placeholder:text-zinc-600 font-medium custom-scrollbar resize-none"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest block">Complexidade da Ficha</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Simples', 'Padrão', 'Avançada'].map((comp) => (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => setCharacterComplexity(comp)}
                          className={`py-1.5 text-[10px] font-mono font-bold rounded-sm border transition cursor-pointer uppercase tracking-widest ${
                            characterComplexity === comp
                              ? 'bg-white border-white text-black'
                              : 'bg-transparent border-white/10 text-zinc-400 hover:bg-white/5'
                          }`}
                        >
                          {comp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleGenerateCharacter}
                    disabled={isGenerating || !characterConcept.trim()}
                    className="w-full relative group overflow-hidden bg-white hover:bg-zinc-200 text-black py-4 px-4 rounded-sm font-display font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isGenerating ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" /> Sincronizando Rede Neural...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} /> FORJAR FICHA
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  </button>
                  <p className="text-center text-[9px] font-mono text-zinc-500 mt-3 tracking-widest uppercase">
                    Pode levar até 10-15s para compilar a ficha completa.
                  </p>
                </div>
              </div>
            </div>

            {/* Generated character preview column */}
            <div className="xl:col-span-8 space-y-6">
              {generatedCharacter ? (
                <CharacterSheetView 
                  character={generatedCharacter} 
                  onUpdateHp={(newHp) => {
                    const next = { ...generatedCharacter, stats: { ...generatedCharacter.stats, hp: newHp } };
                    setGeneratedCharacter(next);
                  }}
                  onUpdateCharacter={(updatedChar) => {
                    setGeneratedCharacter(updatedChar);
                    fetch(`/api/characters/${updatedChar.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updatedChar)
                    }).then(syncData);
                  }}
                />
              ) : (
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-12 text-center text-zinc-500 flex flex-col items-center justify-center space-y-6 h-full min-h-[400px] backdrop-blur-sm">
                  <div className="p-5 bg-white/5 border border-white/10 rounded-none rotate-45 relative">
                    <Sparkles size={24} className="text-zinc-400 -rotate-45" />
                    <div className="absolute inset-0 bg-white/5 filter blur-xl"></div>
                  </div>
                  <div className="max-w-md space-y-3">
                    <h3 className="text-sm font-display font-bold text-zinc-300 uppercase tracking-widest">Aguardando Inicialização</h3>
                    <p className="text-[11px] font-mono text-zinc-500 leading-relaxed tracking-wide">
                      Insira os parâmetros bio-neurais à esquerda. A inteligência artificial irá compilar estatísticas, habilidades nativas, inventário letal e macros automatizadas.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: My Characters list */}
        {activeTab === 'my-characters' && !activeCampaign && (
          <div className="no-print space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-xl font-display font-bold text-white tracking-widest uppercase">Arquivos Neuronais</h2>
              <button 
                onClick={() => setActiveTab('generator')}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-display font-bold rounded-sm transition cursor-pointer tracking-widest uppercase"
              >
                <Plus size={14} /> NOVO
              </button>
            </div>

            {savedCharacters.length === 0 ? (
              <div className="bg-zinc-900/40 border border-white/5 rounded-none p-12 text-center text-zinc-500 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                <FileText size={32} className="text-zinc-700" />
                <p className="text-xs font-mono tracking-widest uppercase">Sem registros armazenados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Characters list side menu */}
                <div className="lg:col-span-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {savedCharacters.map((char) => {
                    const isSelected = generatedCharacter?.id === char.id;
                    return (
                      <button
                        key={char.id}
                        onClick={() => setGeneratedCharacter(char)}
                        className={`w-full p-4 rounded-sm border text-left transition relative overflow-hidden group cursor-pointer ${
                          isSelected
                            ? 'bg-white/5 border-white'
                            : 'bg-zinc-950 border-white/10 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`text-sm font-display font-bold tracking-wide transition ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{char.name}</h3>
                            <p className="text-[10px] text-zinc-500 font-mono capitalize mt-1.5 tracking-wider">Lvl {char.level} • {char.race} • {char.class}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest border rounded-sm font-mono font-bold ${isSelected ? 'bg-white text-black border-white' : 'bg-zinc-900 border-white/10 text-zinc-400'}`}>
                            {char.systems.join(', ').substring(0, 10)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Character preview sheet view */}
                <div className="lg:col-span-8">
                  {generatedCharacter ? (
                    <CharacterSheetView 
                      character={generatedCharacter}
                      onUpdateHp={(newHp) => {
                        const next = { ...generatedCharacter, stats: { ...generatedCharacter.stats, hp: newHp } };
                        setGeneratedCharacter(next);
                        fetch(`/api/characters/${generatedCharacter.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(next)
                        }).then(syncData);
                      }}
                      onUpdateCharacter={(updatedChar) => {
                        setGeneratedCharacter(updatedChar);
                        fetch(`/api/characters/${updatedChar.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(updatedChar)
                        }).then(syncData);
                      }}
                    />
                  ) : (
                    <div className="bg-zinc-900/40 border border-white/5 rounded-none p-12 text-center text-zinc-500 font-mono text-xs tracking-widest uppercase h-full min-h-[400px] flex items-center justify-center">
                      SELECIONE UM REGISTRO PARA EXIBIÇÃO DETALHADA.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Campaigns List & Join panel */}
        {activeTab === 'campaigns' && !activeCampaign && (
          <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create Campaign card */}
            <div className="bg-black border border-white/10 rounded-none p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-1">
                <Shield size={16} className="text-amber-500" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Criar Nova Mesa (Como Mestre)</h2>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Crie um ambiente virtual compartilhado para sua mesa. O mestre do jogo (GM) poderá configurar mapas de batalha, acompanhar a saúde e fichas dos personagens, gerenciar turnos na fila de iniciativa e narrar a campanha.
              </p>

              <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Nome da Campanha</label>
                  <input
                    type="text"
                    placeholder="Ex: As Crônicas de Valkaria, Dungeon of Doom..."
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Sistema Principal</label>
                  <select
                    value={newCampaignSystem}
                    onChange={(e) => setNewCampaignSystem(e.target.value as RPGSystem)}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="D&D 5e">Dungeons & Dragons 5e</option>
                    <option value="Pathfinder 2e">Pathfinder 2e</option>
                    <option value="Tormenta20">Tormenta20</option>
                    <option value="Call of Cthulhu">Chamado de Cthulhu (CoC)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-sm transition cursor-pointer"
                >
                  Criar Mesa de Jogo
                </button>
              </form>
            </div>

            {/* Join Campaign card */}
            <div className="bg-black border border-white/10 rounded-none p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-1">
                <Users size={16} className="text-indigo-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Entrar em uma Campanha (Jogador)</h2>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Insira o código de convite enviado pelo seu mestre de RPG para conectar seu personagem gerado à campanha em tempo real.
              </p>

              <form onSubmit={handleJoinCampaign} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Código da Campanha</label>
                    <input
                      type="text"
                      placeholder="Ex: XYZ987"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 uppercase font-mono text-center font-bold tracking-widest"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Selecionar Personagem</label>
                    <select
                      value={selectedCampaignCharId}
                      onChange={(e) => setSelectedCampaignCharId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">-- Nenhum (Apenas Espectador) --</option>
                      {savedCharacters.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.system})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-sm transition cursor-pointer"
                >
                  Conectar à Mesa de RPG
                </button>
              </form>
            </div>

            {/* Existing Active Campaigns list */}
            {campaigns.length > 0 && (
              <div className="md:col-span-2 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Minhas Mesas Ativas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {campaigns.map((camp) => {
                    const amGm = camp.gmId === userId;
                    return (
                      <div 
                        key={camp.id}
                        className="bg-black border border-white/10 rounded-none p-4 flex flex-col justify-between hover:border-indigo-500/20 transition relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">{camp.name}</h4>
                            <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 rounded text-indigo-400 font-mono font-bold">
                              {camp.systems.join(', ')}
                            </span>
                          </div>
                          
                          <div className="text-[10px] text-zinc-500 font-medium space-y-0.5">
                            <div>Narrador (GM): <strong className="text-zinc-300">{camp.gmName} {amGm ? '(Você)' : ''}</strong></div>
                            <div>Jogadores Conectados: <strong className="text-zinc-300">{camp.players.length}</strong></div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveCampaign(camp);
                            setActiveTab('campaigns');
                          }}
                          className="w-full mt-4 py-1.5 bg-white/5 hover:bg-slate-800 text-xs font-bold rounded border border-white/10 hover:border-slate-700 transition cursor-pointer text-zinc-300"
                        >
                          Abrir Sala do Jogo
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3.1: Inside Active Campaign (Multiplayer Session View) */}
        {activeCampaign && (
          <div className="space-y-6">
            {/* Session Header Controls (No Print) */}
            <div className="no-print bg-black border border-white/10 rounded-none p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{activeCampaign.systems.join(', ')} Campanha</span>
                <h2 className="text-xl font-black text-white">{activeCampaign.name}</h2>
              </div>

              {/* Invite action and exit */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-sm border border-white/10 font-mono text-xs">
                  <span className="text-zinc-600 font-bold">Código do Convite:</span>
                  <span className="text-indigo-400 font-bold tracking-widest uppercase">{activeCampaign.code}</span>
                  <button
                    onClick={() => handleCopyInviteCode(activeCampaign.code)}
                    className="text-zinc-500 hover:text-white transition ml-1 cursor-pointer"
                    title="Copiar código de convite"
                  >
                    {copiedInviteCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>

                <button
                  onClick={() => setActiveCampaign(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-sm border border-slate-700 transition text-zinc-300 cursor-pointer"
                >
                  Sair da Campanha
                </button>
              </div>
            </div>

            {/* Campaign Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Tactical Map & Notes */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Tactical map shared whiteboard */}
                <MapBoard 
                  map={activeCampaign.map} 
                  isGm={activeCampaign.gmId === userId} 
                  onUpdateMap={handleUpdateMap} 
                />

                {/* 2. Adventure Sync Notes & campaign summarizing to PDF */}
                <div className="bg-black border border-white/10 rounded-none p-6 text-zinc-300 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
                    <div className="flex items-center gap-2">
                      <FileText className="text-indigo-400" size={18} />
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Diário da Campanha (Notas Sincronizadas)</h2>
                    </div>
                    <button
                      onClick={exportCampaignSummaryPdf}
                      className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded border border-slate-700 transition cursor-pointer"
                    >
                      <Printer size={12} /> Imprimir Resumo / PDF
                    </button>
                  </div>

                  {/* Add Note form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const target = e.target as any;
                      const title = target.noteTitle.value;
                      const content = target.noteContent.value;
                      if (!title || !content) return;
                      handleAddNote(title, content);
                      target.reset();
                    }}
                    className="no-print bg-white/5 p-4 rounded-sm border border-white/10/80 space-y-3"
                  >
                    <h3 className="text-xs font-bold text-zinc-300">Nova Nota de Aventura</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        name="noteTitle"
                        placeholder="Título da nota (Ex: Encontro com o Dragão)..."
                        className="bg-black border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        name="noteContent"
                        placeholder="Detalhes rápidos..."
                        className="bg-black border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-xs transition cursor-pointer"
                    >
                      Sincronizar Nota
                    </button>
                  </form>

                  {/* Notes List */}
                  {activeCampaign.notes.length === 0 ? (
                    <div className="no-print bg-white/5/20 border border-dashed border-white/10 rounded-sm p-6 text-center text-xs text-zinc-600">
                      Nenhum registro de aventura no diário ainda. Escreva as notas acima para que todos os jogadores visualizem o progresso em tempo real.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeCampaign.notes.map(note => (
                        <div key={note.id} className="bg-white/5 p-4 rounded-sm border border-white/10/60 relative group">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-xs font-bold text-white tracking-wide">{note.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-zinc-600">Por {note.authorName}</span>
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="no-print text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                title="Deletar nota"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Battle Tracker, Player Status, Chat Panel */}
              <div className="lg:col-span-1 space-y-6">
                {/* 1. Initiative Tracker & Combat Turn Timer */}
                <CombatTrackerComponent 
                  combat={activeCampaign.combat} 
                  isGm={activeCampaign.gmId === userId} 
                  onUpdateCombat={handleUpdateCombat} 
                />

                {/* 2. Chat Panel */}
                <ChatPanel 
                  campaignId={activeCampaign.id} 
                  messages={activeCampaign.messages} 
                  currentUserId={userId} 
                  currentUserName={userName} 
                  isGm={activeCampaign.gmId === userId} 
                  playersList={activeCampaign.players}
                  onSendMessage={handleSendMessage} 
                />

                {/* 3. Multiplayer Players Connected Sheets Overview */}
                <div className="bg-black border border-white/10 rounded-none p-5 text-zinc-300 shadow-xl space-y-4 no-print">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-1">
                    <Users size={16} className="text-indigo-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Jogadores Conectados ({activeCampaign.players.length})</h2>
                  </div>

                  <div className="space-y-3">
                    {activeCampaign.players.map(p => {
                      return (
                        <div key={p.userId} className="p-3 bg-white/5 rounded-sm border border-white/10/80 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-white">{p.userName}</div>
                            <div className="text-[10px] text-zinc-500">
                              ID: {p.userId.substring(0, 8)}... {activeCampaign.gmId === p.userId ? '(Mestre)' : '(Jogador)'}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-indigo-400">
                            {p.characterId ? 'Ficha Conectada' : 'Apenas Observador'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Searchable Magic Items Codex */}
        {activeTab === 'magic-items' && !activeCampaign && (
          <div className="no-print">
            <MagicItemsDb />
          </div>
        )}

        {/* Tab 5: Tools & Utilities */}
        {activeTab === 'tools' && !activeCampaign && (
          <div className="no-print h-[calc(100vh-250px)]">
            <GMTools />
          </div>
        )}

        {/* Tab 6: Bestiary */}
        {activeTab === 'bestiary' && !activeCampaign && (
          <div className="no-print h-[calc(100vh-250px)]">
            <BestiaryDb />
          </div>
        )}

      </main>

      {/* Footer Details */}
      <footer className="no-print bg-black border-t border-white/10 py-6 mt-12 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>© {new Date().getFullYear()} RPG Character Builder & Companion. Criado com o modelo inteligente Gemini e arquitetura autônoma.</p>
          <p className="text-[10px]">Todas as fichas, macros de Roll20, dados do Foundry VTT e ambientações sintetizadas são gerados no servidor local com alta performance.</p>
        </div>
      </footer>
    </div>
  );
}
