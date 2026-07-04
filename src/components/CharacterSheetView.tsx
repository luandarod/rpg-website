import React, { useState } from 'react';
import { Character } from '../types';
import { Download, FileCode, Printer, ShieldAlert, Award, Copy, Check, Sparkles, Shield, User, Compass, FileText } from 'lucide-react';

interface SystemTheme {
  primaryColor: string;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
  glowColor: string;
  ambientBg: string;
  fontFamily: string;
  systemLabel: string;
}

interface AttributeDisplay {
  score: string | number;
  modText: string;
  showMod: boolean;
  dots: number | null;
}

const getAttributeDisplay = (system: string, name: string, val: number): AttributeDisplay => {
  const normalizedSystem = system.toLowerCase();
  if (normalizedSystem.includes('5e') || normalizedSystem.includes('3.5') || normalizedSystem.includes('d&d') || normalizedSystem.includes('dungeons')) {
    const mod = Math.floor((val - 10) / 2);
    return {
      score: val,
      modText: mod >= 0 ? `+${mod}` : `${mod}`,
      showMod: true,
      dots: null
    };
  }
  if (normalizedSystem.includes('pathfinder') || normalizedSystem.includes('tormenta')) {
    if (val <= 6 && val >= -5) {
      return {
        score: val >= 0 ? `+${val}` : `${val}`,
        modText: '',
        showMod: false,
        dots: null
      };
    } else {
      const mod = Math.floor((val - 10) / 2);
      return {
        score: val,
        modText: mod >= 0 ? `+${mod}` : `${mod}`,
        showMod: true,
        dots: null
      };
    }
  }
  if (normalizedSystem.includes('cthulhu')) {
    const half = Math.floor(val / 2);
    const fifth = Math.floor(val / 5);
    return {
      score: `${val}%`,
      modText: `${half}/${fifth}`,
      showMod: true,
      dots: null
    };
  }
  if (normalizedSystem.includes('vampire') || normalizedSystem.includes('vampiro')) {
    return {
      score: '',
      modText: '',
      showMod: false,
      dots: val
    };
  }
  if (normalizedSystem.includes('cyberpunk')) {
    return {
      score: val,
      modText: '',
      showMod: false,
      dots: null
    };
  }
  if (normalizedSystem.includes('ordem') || normalizedSystem.includes('paranormal')) {
    return {
      score: `${val}D`,
      modText: `${val}d20`,
      showMod: true,
      dots: null
    };
  }
  
  if (val >= 8) {
    const mod = Math.floor((val - 10) / 2);
    return {
      score: val,
      modText: mod >= 0 ? `+${mod}` : `${mod}`,
      showMod: true,
      dots: null
    };
  }
  return {
    score: val,
    modText: '',
    showMod: false,
    dots: null
  };
};

const getSystemTheme = (sys: string): SystemTheme => {
  switch(sys) {
    case 'D&D 5e':
      return {
        primaryColor: 'text-red-400',
        accentColor: 'red',
        borderColor: 'border-red-500/30',
        badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
        glowColor: 'shadow-red-500/5',
        ambientBg: 'from-red-950/20 to-slate-950',
        fontFamily: 'font-sans',
        systemLabel: 'Dungeons & Dragons 5e'
      };
    case 'D&D 3.5':
      return {
        primaryColor: 'text-amber-500',
        accentColor: 'amber',
        borderColor: 'border-amber-600/30',
        badgeBg: 'bg-amber-600/10 text-amber-400 border-amber-600/30',
        glowColor: 'shadow-amber-500/5',
        ambientBg: 'from-amber-950/15 to-slate-950',
        fontFamily: 'font-serif',
        systemLabel: 'Dungeons & Dragons 3.5'
      };
    case 'Pathfinder 2e':
      return {
        primaryColor: 'text-cyan-400',
        accentColor: 'cyan',
        borderColor: 'border-cyan-500/30',
        badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        glowColor: 'shadow-cyan-500/5',
        ambientBg: 'from-cyan-950/20 to-slate-950',
        fontFamily: 'font-sans',
        systemLabel: 'Pathfinder 2e Remaster'
      };
    case 'Tormenta20':
      return {
        primaryColor: 'text-fuchsia-400',
        accentColor: 'fuchsia',
        borderColor: 'border-fuchsia-500/30',
        badgeBg: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
        glowColor: 'shadow-fuchsia-500/5',
        ambientBg: 'from-fuchsia-950/20 to-slate-950',
        fontFamily: 'font-sans',
        systemLabel: 'Tormenta20 JdA'
      };
    case 'Call of Cthulhu':
      return {
        primaryColor: 'text-emerald-400',
        accentColor: 'emerald',
        borderColor: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        glowColor: 'shadow-emerald-500/5',
        ambientBg: 'from-emerald-950/20 to-slate-950',
        fontFamily: 'font-serif',
        systemLabel: 'Chamado de Cthulhu 7e'
      };
    case 'Vampire: Masquerade 5e':
      return {
        primaryColor: 'text-rose-500',
        accentColor: 'rose',
        borderColor: 'border-rose-500/30',
        badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        glowColor: 'shadow-rose-500/10',
        ambientBg: 'from-rose-950/30 to-slate-950',
        fontFamily: 'font-serif',
        systemLabel: 'Vampiro: A Máscara V5'
      };
    case 'Cyberpunk RED':
      return {
        primaryColor: 'text-yellow-400',
        accentColor: 'yellow',
        borderColor: 'border-yellow-500/30',
        badgeBg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        glowColor: 'shadow-yellow-500/10',
        ambientBg: 'from-yellow-950/15 to-slate-950',
        fontFamily: 'font-mono',
        systemLabel: 'Cyberpunk RED'
      };
    case 'Ordem Paranormal':
      return {
        primaryColor: 'text-sky-400',
        accentColor: 'sky',
        borderColor: 'border-sky-500/30',
        badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
        glowColor: 'shadow-sky-500/5',
        ambientBg: 'from-sky-950/20 to-slate-950',
        fontFamily: 'font-mono',
        systemLabel: 'Ordem Paranormal'
      };
    default:
      return {
        primaryColor: 'text-indigo-400',
        accentColor: 'indigo',
        borderColor: 'border-indigo-500/30',
        badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        glowColor: 'shadow-indigo-500/5',
        ambientBg: 'from-indigo-950/20 to-slate-950',
        fontFamily: 'font-sans',
        systemLabel: 'Ficha de Personagem'
      };
  }
};

interface CharacterSheetViewProps {
  character: Character;
  onUpdateHp?: (newHp: number) => void;
  onUpdateCharacter?: (updatedChar: Character) => void;
}

export default function CharacterSheetView({ character, onUpdateHp, onUpdateCharacter }: CharacterSheetViewProps) {
  const theme = getSystemTheme(character.systems[0]);
  const [copiedRoll20, setCopiedRoll20] = useState(false);
  const [copiedFoundry, setCopiedFoundry] = useState(false);
  const [currentHp, setCurrentHp] = useState(character.stats.hp);
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);

  // Sync HP state with character prop changes when switching characters
  React.useEffect(() => {
    setCurrentHp(character.stats.hp);
  }, [character.stats.hp, character.id]);

  const handleGenerateAiPortrait = async () => {
    if (isGeneratingPortrait) return;
    setIsGeneratingPortrait(true);
    try {
      const res = await fetch('/api/gemini/generate-portrait', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appearance: character.appearance,
          name: character.name,
          race: character.race,
          characterClass: character.class,
          system: character.systems[0]
        })
      });
      if (!res.ok) throw new Error("Erro na geração do retrato.");
      const data = await res.json();
      if (data.imageUrl && onUpdateCharacter) {
        onUpdateCharacter({ ...character, avatarUrl: data.imageUrl });
      }
    } catch (err: any) {
      console.error(err);
      // Fallback
      const seedString = encodeURIComponent(`${character.name}-${character.race}-${character.class}`.replace(/\s+/g, '-'));
      const fallbackUrl = `https://picsum.photos/seed/${seedString}/400/400`;
      if (onUpdateCharacter) {
        onUpdateCharacter({ ...character, avatarUrl: fallbackUrl });
      }
    } finally {
      setIsGeneratingPortrait(false);
    }
  };

  const handleCopyRoll20 = () => {
    navigator.clipboard.writeText(character.roll20Macro);
    setCopiedRoll20(true);
    setTimeout(() => setCopiedRoll20(false), 2000);
  };

  const handleCopyFoundry = () => {
    navigator.clipboard.writeText(character.foundryActorJson);
    setCopiedFoundry(true);
    setTimeout(() => setCopiedFoundry(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${character.name.toLowerCase().replace(/\s+/g, '_')}_ficha.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const updateHpVal = (amount: number) => {
    const nextHp = Math.max(0, Math.min(character.stats.maxHp, currentHp + amount));
    setCurrentHp(nextHp);
    if (onUpdateHp) {
      onUpdateHp(nextHp);
    }
  };

  return (
    <div className={`bg-zinc-950 border ${theme.borderColor} rounded-none p-8 text-zinc-300 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-4xl mx-auto printable-sheet relative overflow-hidden bg-gradient-to-br ${theme.ambientBg} ${theme.fontFamily} transition-all duration-500 ring-1 ring-white/5`}>
      {/* Header Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-white/10 no-print">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase border ${theme.badgeBg}`}>
            {character.systems.join(", ")}
          </span>
          <span className={`px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-white/5 text-zinc-300 border border-white/10`}>
            Nível {character.level}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 bg-transparent hover:bg-white/5 transition rounded-sm text-[10px] font-mono tracking-widest uppercase border border-white/10 cursor-pointer text-zinc-400 hover:text-white"
          >
            <Printer size={12} /> IMPRIMIR
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-3 py-1.5 bg-transparent hover:bg-white/5 transition rounded-sm text-[10px] font-mono tracking-widest uppercase border border-white/10 cursor-pointer text-zinc-400 hover:text-white"
          >
            <Download size={12} /> DUMP JSON
          </button>
        </div>
      </div>

      {/* Main Sheet Structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Basic Info & Attributes */}
        <div className="md:col-span-1 space-y-6">
          {/* Identity Card */}
          <div className={`bg-black/50 p-6 border ${theme.borderColor} relative overflow-hidden shadow-2xl backdrop-blur-md`}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${theme.primaryColor.replace('text-', 'bg-')}/5 rounded-full blur-2xl pointer-events-none`} />
            <h2 className={`text-3xl font-display font-bold tracking-tighter uppercase ${theme.primaryColor}`}>{character.name}</h2>
            <div className="text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest flex flex-wrap gap-2 items-center">
              <span>{character.race}</span>
              <span className="text-white/20">|</span>
              <span className="text-zinc-300">{character.class}</span>
              {character.archetype && (
                <>
                  <span className="text-white/20">|</span>
                  <span className="text-zinc-400 font-bold">{character.archetype}</span>
                </>
              )}
            </div>

            {/* Interactive Portrait / Avatar */}
            <div className="mt-6 mb-6 relative group border border-white/10 bg-black aspect-square">
              <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                <img
                  src={character.avatarUrl || `https://picsum.photos/seed/${encodeURIComponent(character.name + '-' + character.race + '-' + character.class)}/400/400`}
                  alt={character.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] contrast-125"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                
                {isGeneratingPortrait && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-3 text-[10px] font-mono tracking-widest uppercase text-white font-bold backdrop-blur-sm">
                    <Sparkles size={20} className="animate-spin text-white" />
                    <span>Renderizando...</span>
                  </div>
                )}
              </div>
              
              {/* Image Controls - Hidden in print */}
              <div className="absolute bottom-2 right-2 flex gap-1.5 no-print">
                <button
                  onClick={async () => {
                    const promptUrl = prompt("Insira a URL de uma imagem para o seu personagem:");
                    if (promptUrl && onUpdateCharacter) {
                      onUpdateCharacter({ ...character, avatarUrl: promptUrl });
                    }
                  }}
                  className="px-2 py-1 bg-black/80 hover:bg-white text-[9px] text-zinc-400 hover:text-black border border-white/10 transition font-mono font-bold tracking-widest flex items-center gap-1 cursor-pointer uppercase backdrop-blur-md"
                  title="Mudar Imagem"
                >
                  <User size={10} /> LINK
                </button>
                <button
                  onClick={handleGenerateAiPortrait}
                  disabled={isGeneratingPortrait}
                  className="px-2 py-1 bg-white hover:bg-zinc-200 disabled:bg-white/20 disabled:text-white/50 text-[9px] text-black border border-white transition font-mono font-bold tracking-widest flex items-center gap-1 cursor-pointer uppercase"
                  title="Gerar Retrato com IA"
                >
                  <Sparkles size={10} className={isGeneratingPortrait ? "animate-spin" : ""} /> {isGeneratingPortrait ? "PROCESSANDO" : "I.A"}
                </button>
              </div>
            </div>
            
            {character.origin && (
               <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-4 border-t border-white/5 pt-4">
                <span className="text-zinc-600">ORIGEM //</span> <span className="text-zinc-300 font-bold">{character.origin}</span>
              </div>
            )}

            <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-2">
              <span className="text-zinc-600">ALINHAMENTO //</span> <span className="text-zinc-300 font-bold">{character.alignment}</span>
            </div>

            {character.subsystem && (
              <div className={`mt-4 inline-block px-2 py-1 text-[9px] font-bold font-mono tracking-widest uppercase border ${theme.badgeBg}`}>
                {character.subsystem}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {character.complexity && (
                <span className="text-[8px] font-bold tracking-widest uppercase text-zinc-500 bg-black px-1.5 py-0.5 border border-white/10">
                  ESTRUTURA: {character.complexity}
                </span>
              )}
              {character.attributeFocus && (
                <span className="text-[8px] font-bold tracking-widest uppercase text-zinc-500 bg-black px-1.5 py-0.5 border border-white/10">
                  FOCO: {character.attributeFocus}
                </span>
              )}
            </div>
            
            {/* Interactive HP Panel */}
            <div className="mt-6 pt-5 border-t border-white/10 no-print">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-widest">SISTEMAS VITAIS</span>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">{currentHp} / {character.stats.maxHp}</span>
              </div>
              <div className="w-full bg-black border border-white/5 h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                  style={{ width: `${(currentHp / character.stats.maxHp) * 100}%` }}
                />
              </div>
              <div className="flex gap-1.5 mt-4">
                <button 
                  onClick={() => updateHpVal(-1)} 
                  className="flex-1 py-1.5 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition text-xs font-mono font-bold cursor-pointer"
                >
                  -1
                </button>
                <button 
                  onClick={() => updateHpVal(-5)} 
                  className="flex-1 py-1.5 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition text-xs font-mono font-bold cursor-pointer"
                >
                  -5
                </button>
                <button 
                  onClick={() => updateHpVal(1)} 
                  className="flex-1 py-1.5 bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition text-xs font-mono font-bold cursor-pointer"
                >
                  +1
                </button>
                <button 
                  onClick={() => updateHpVal(5)} 
                  className="flex-1 py-1.5 bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition text-xs font-mono font-bold cursor-pointer"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Static HP display for printing */}
            <div className="hidden print-block mt-4 text-[10px] font-mono tracking-widest uppercase">
              <strong>VITAIS:</strong> {currentHp} / {character.stats.maxHp}
            </div>
          </div>

          {/* Core Stats (AC, Speed, Initiative) */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`bg-black/50 p-4 border ${theme.borderColor} text-center shadow-xl backdrop-blur-md`}>
              <div className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono font-bold">ARMADURA</div>
              <div className={`text-2xl font-bold font-mono ${theme.primaryColor} mt-2`}>{character.stats.ac}</div>
            </div>
            <div className={`bg-black/50 p-4 border ${theme.borderColor} text-center shadow-xl backdrop-blur-md`}>
              <div className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono font-bold">REAÇÃO</div>
              <div className="text-2xl font-bold font-mono text-white mt-2">
                {character.stats.initiative >= 0 ? `+${character.stats.initiative}` : character.stats.initiative}
              </div>
            </div>
            <div className={`bg-black/50 p-4 border ${theme.borderColor} text-center shadow-xl backdrop-blur-md`}>
              <div className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono font-bold">MOTOR</div>
              <div className="text-sm font-bold text-white mt-3 truncate uppercase tracking-widest">{character.stats.speed}</div>
            </div>
          </div>

          {/* Attributes List */}
          <div className={`bg-black/50 p-6 border ${theme.borderColor} shadow-xl backdrop-blur-md`}>
            <h3 className={`text-[10px] font-mono font-bold uppercase tracking-widest ${theme.primaryColor} mb-4 border-b border-white/10 pb-2`}>PARAMETROS</h3>
            <div className="space-y-2">
              {Object.entries(character.attributes).map(([key, val]) => {
                const display = getAttributeDisplay(character.systems[0], key, val);

                return (
                  <div key={key} className={`flex justify-between items-center bg-black/40 p-2.5 border ${theme.borderColor}/30 hover:bg-white/5 transition`}>
                    <span className="text-[11px] font-mono font-bold tracking-widest text-zinc-300 uppercase">{key}</span>
                    <div className="flex items-center gap-2">
                      {display.dots !== null ? (
                        <div className="flex gap-1.5 items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                              key={i} 
                              className={`w-2.5 h-2.5 rounded-sm border transition-all ${
                                i < display.dots! 
                                  ? 'bg-white border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                                  : 'bg-transparent border-white/20'
                              }`} 
                            />
                          ))}
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-bold font-mono text-white">{display.score}</span>
                          {display.showMod && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold font-mono border uppercase ${theme.badgeBg}`}>
                              {display.modText}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center/Right Column: Skills, Inventory, Abilities & Integration */}
        <div className="md:col-span-2 space-y-8">
          {/* Biography & Backstory */}
          <div className={`bg-black/50 p-6 border ${theme.borderColor} shadow-xl backdrop-blur-md`}>
            <h3 className={`text-[10px] font-mono font-bold uppercase tracking-widest ${theme.primaryColor} mb-4 border-b border-white/10 pb-2`}>MEMÓRIAS NEURAIS</h3>
            <div className="text-xs font-mono text-zinc-300 leading-relaxed space-y-2 whitespace-pre-wrap tracking-wide">
              {character.backstory}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/5 text-[11px] font-mono tracking-wide">
              <div>
                <strong className="text-zinc-500 block mb-2 uppercase tracking-widest font-bold">COMPORTAMENTO //</strong>
                <span className="text-zinc-200 leading-relaxed italic">"{character.personality}"</span>
              </div>
              <div>
                <strong className="text-zinc-500 block mb-2 uppercase tracking-widest font-bold">CASCA //</strong>
                <span className="text-zinc-200 leading-relaxed">{character.appearance}</span>
              </div>
            </div>
          </div>

          {/* Abilities & Features */}
          <div className={`bg-black/50 p-6 border ${theme.borderColor} shadow-xl backdrop-blur-md`}>
            <h3 className={`text-[10px] font-mono font-bold uppercase tracking-widest ${theme.primaryColor} mb-4 border-b border-white/10 pb-2 flex items-center gap-2`}>
              <Award size={14} /> ROTINAS & PROTOCOLOS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {character.abilities.map((ab, idx) => (
                <div key={idx} className={`bg-black p-4 border border-white/5 hover:${theme.borderColor} transition duration-300`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[11px] font-bold font-mono tracking-widest text-white uppercase">{ab.name}</h4>
                    {ab.type && (
                      <span className="text-[8px] uppercase tracking-widest font-mono font-bold px-1.5 py-0.5 border border-white/10 text-zinc-400">
                        {ab.type}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-zinc-400 leading-relaxed tracking-wide">{ab.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Column split for Skills and Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Skills */}
            <div className={`bg-black/50 p-6 border ${theme.borderColor} shadow-xl backdrop-blur-md`}>
              <h3 className={`text-[10px] font-mono font-bold uppercase tracking-widest ${theme.primaryColor} mb-4 border-b border-white/10 pb-2`}>MODULOS DE PERÍCIA</h3>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {character.skills.map((sk, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 hover:bg-white/5 transition text-[11px] border-b border-white/5 last:border-0">
                    <span className="text-zinc-300 flex items-center gap-2 truncate font-mono uppercase tracking-widest">
                      <span className={`w-1.5 h-1.5 rounded-none ${sk.trained ? theme.primaryColor.split(' ')[0].replace('text-', 'bg-') : 'bg-transparent border border-white/20'}`} />
                      {sk.name}
                    </span>
                    <span className="font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 rounded-sm">
                      {sk.bonus >= 0 ? `+${sk.bonus}` : sk.bonus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment / Inventory */}
            <div className={`bg-black/50 p-6 border ${theme.borderColor} shadow-xl backdrop-blur-md`}>
              <h3 className={`text-[10px] font-mono font-bold uppercase tracking-widest ${theme.primaryColor} mb-4 border-b border-white/10 pb-2`}>INVENTÁRIO</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {character.inventory.map((item, idx) => (
                  <div key={idx} className="bg-black p-3 border border-white/5 text-[11px] font-mono tracking-wide">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-white uppercase tracking-widest">{item.name}</span>
                      <span className="text-[9px] font-bold text-zinc-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-sm">x{item.quantity}</span>
                    </div>
                    {item.description && <p className="text-[9px] text-zinc-500 leading-tight uppercase tracking-wider">{item.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roll20 & Foundry Integrations */}
          <div className={`bg-black/50 p-6 border ${theme.borderColor} no-print space-y-6 shadow-xl backdrop-blur-md`}>
            <h3 className={`text-[10px] font-mono font-bold uppercase tracking-widest ${theme.primaryColor} border-b border-white/10 pb-2 flex items-center gap-2`}>
              <Sparkles size={14} className={`${theme.primaryColor}`} /> EXPORTAÇÃO DE DADOS (VTT)
            </h3>
            <p className="text-[10px] font-mono tracking-wide text-zinc-400 leading-relaxed uppercase">
              Integração direta de protocolos para simulações táticas (Roll20 / Foundry VTT). Copie os hashes gerados.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Roll20 copy-macro card */}
              <div className="bg-black p-4 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white font-mono font-bold tracking-widest uppercase text-[10px] mb-2">
                    <FileCode size={12} className="text-zinc-500" /> MACRO ROLL20
                  </div>
                  <p className="text-[9px] font-mono tracking-wider text-zinc-500 mb-4 uppercase">
                    Protocolo de atalho rápido para combate e rolagens chave no sistema Roll20.
                  </p>
                </div>
                <button
                  onClick={handleCopyRoll20}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white text-zinc-300 hover:text-black text-[10px] font-mono font-bold tracking-widest uppercase border border-white/10 transition cursor-pointer"
                >
                  {copiedRoll20 ? (
                    <>
                      <Check size={12} className="text-emerald-500" /> COPIADO
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> TRANSFERIR
                    </>
                  )}
                </button>
              </div>

              {/* Foundry Actor JSON card */}
              <div className="bg-black p-4 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white font-mono font-bold tracking-widest uppercase text-[10px] mb-2">
                    <FileCode size={12} className="text-zinc-500" /> DUMP FOUNDRY VTT
                  </div>
                  <p className="text-[9px] font-mono tracking-wider text-zinc-500 mb-4 uppercase">
                    Estrutura de dados bruta no formato padrão Foundry para importação nativa.
                  </p>
                </div>
                <button
                  onClick={handleCopyFoundry}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white text-zinc-300 hover:text-black text-[10px] font-mono font-bold tracking-widest uppercase border border-white/10 transition cursor-pointer"
                >
                  {copiedFoundry ? (
                    <>
                      <Check size={12} className="text-emerald-500" /> COPIADO
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> TRANSFERIR
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
