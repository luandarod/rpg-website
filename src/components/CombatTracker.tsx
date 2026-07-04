import React, { useState, useEffect } from 'react';
import { CombatTracker as TrackerType, CombatCombatant } from '../types';
import { Shield, Flame, Timer, Play, RotateCcw, SkipForward, Plus, Trash2, Heart, Swords } from 'lucide-react';

interface CombatTrackerProps {
  combat: TrackerType;
  isGm: boolean;
  onUpdateCombat: (newCombat: TrackerType) => void;
}

export default function CombatTracker({ combat, isGm, onUpdateCombat }: CombatTrackerProps) {
  const [secondsLeft, setSecondsLeft] = useState(combat.turnTimeLimit);
  const [timerActive, setTimerActive] = useState(false);
  const [customMonsterName, setCustomMonsterName] = useState('');
  const [customMonsterHp, setCustomMonsterHp] = useState(15);
  const [customMonsterAc, setCustomMonsterAc] = useState(12);
  const [customMonsterInit, setCustomMonsterInit] = useState(10);

  // Countdown timer logic
  useEffect(() => {
    let interval: any = null;
    if (timerActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && timerActive) {
      setTimerActive(false);
      // Auto advance or trigger alert
    }

    return () => clearInterval(interval);
  }, [timerActive, secondsLeft]);

  // Reset timer on active turn changes
  useEffect(() => {
    setSecondsLeft(combat.turnTimeLimit);
    if (combat.active && combat.combatants.length > 0) {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [combat.currentTurnIndex, combat.active, combat.turnTimeLimit, combat.combatants.length]);

  const handleStartCombat = () => {
    if (combat.combatants.length === 0) return;
    
    // Sort combatants by initiative descending
    const sorted = [...combat.combatants].sort((a, b) => b.initiative - a.initiative);
    
    onUpdateCombat({
      ...combat,
      active: true,
      combatants: sorted,
      currentTurnIndex: 0,
      round: 1
    });
    setSecondsLeft(combat.turnTimeLimit);
    setTimerActive(true);
  };

  const handleStopCombat = () => {
    onUpdateCombat({
      ...combat,
      active: false,
      currentTurnIndex: 0
    });
    setTimerActive(false);
  };

  const handleNextTurn = () => {
    if (combat.combatants.length === 0) return;

    let nextIndex = combat.currentTurnIndex + 1;
    let nextRound = combat.round;

    if (nextIndex >= combat.combatants.length) {
      nextIndex = 0;
      nextRound += 1;
    }

    onUpdateCombat({
      ...combat,
      currentTurnIndex: nextIndex,
      round: nextRound
    });
  };

  const handleResetTimer = () => {
    setSecondsLeft(combat.turnTimeLimit);
    setTimerActive(true);
  };

  const handleAddMonster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMonsterName.trim()) return;

    const newMonster: CombatCombatant = {
      id: 'monster-' + Date.now().toString(36),
      name: customMonsterName.trim(),
      hp: customMonsterHp,
      maxHp: customMonsterHp,
      ac: customMonsterAc,
      initiative: customMonsterInit,
      isMonster: true
    };

    const newCombatants = [...combat.combatants, newMonster];
    // If active, keep sorted
    if (combat.active) {
      newCombatants.sort((a, b) => b.initiative - a.initiative);
    }

    onUpdateCombat({
      ...combat,
      combatants: newCombatants
    });

    setCustomMonsterName('');
  };

  const handleRemoveCombatant = (id: string) => {
    onUpdateCombat({
      ...combat,
      combatants: combat.combatants.filter(c => c.id !== id)
    });
  };

  const handleAdjustMonsterHp = (id: string, amount: number) => {
    onUpdateCombat({
      ...combat,
      combatants: combat.combatants.map(c => {
        if (c.id === id) {
          const nextHp = Math.max(0, Math.min(c.maxHp, c.hp + amount));
          return { ...c, hp: nextHp };
        }
        return c;
      })
    });
  };

  const activeTurnCombatant = combat.combatants[combat.currentTurnIndex];

  return (
    <div className="bg-black border border-white/10 shadow-2xl p-6 text-zinc-300 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Swords className="text-amber-500 animate-bounce" size={20} />
          <h2 className="text-lg font-bold text-white">Cronômetro de Batalha</h2>
        </div>

        {combat.active && (
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2  border border-white/10 font-mono">
            <Timer className={`text-amber-400 ${timerActive ? 'animate-spin' : ''}`} size={16} />
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wide">Tempo do Turno:</span>
            <span className={`text-sm font-bold ${secondsLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
              {secondsLeft}s
            </span>
            <button
              onClick={handleResetTimer}
              className="ml-2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
              title="Resetar tempo"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Active Turn Alert Header */}
      {combat.active && activeTurnCombatant && (
        <div className="bg-amber-500/10 border-2 border-amber-500/20  p-4 flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Turno Ativo de Batalha</div>
            <div className="text-xl font-black text-white flex items-center gap-2">
              <Flame size={18} className="text-amber-400" />
              {activeTurnCombatant.name}
              {activeTurnCombatant.isMonster && (
                <span className="text-[10px] bg-red-500/25 text-red-300 px-2 py-0.5 rounded border border-red-500/30">
                  Inimigo
                </span>
              )}
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              Rodada: <span className="text-white font-bold">{combat.round}</span> • Iniciativa: <span className="text-amber-400 font-bold">{activeTurnCombatant.initiative}</span>
            </div>
          </div>

          {isGm && (
            <button
              onClick={handleNextTurn}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-extrabold text-xs tracking-wider  transition uppercase cursor-pointer"
            >
              Próximo Turno <SkipForward size={14} />
            </button>
          )}
        </div>
      )}

      {/* Combatant List & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Initiative Order List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Fila de Iniciativa</h3>
            <div className="flex gap-2">
              {isGm && !combat.active && (
                <button
                  onClick={handleStartCombat}
                  disabled={combat.combatants.length === 0}
                  className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-bold  text-white cursor-pointer"
                >
                  <Play size={12} /> Iniciar Combate
                </button>
              )}
              {isGm && combat.active && (
                <button
                  onClick={handleStopCombat}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-500 text-xs font-bold  text-white cursor-pointer"
                >
                  Parar Combate
                </button>
              )}
            </div>
          </div>

          {combat.combatants.length === 0 ? (
            <div className="bg-white/5/40 border border-dashed border-white/10  p-8 text-center text-xs text-slate-500">
              Nenhum combatente na lista. Personagens de jogadores adicionados à campanha e monstros de testes aparecerão aqui.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              {combat.combatants.map((c, idx) => {
                const isCurrentTurn = combat.active && combat.currentTurnIndex === idx;

                return (
                  <div
                    key={c.id}
                    className={`p-3  border transition flex items-center justify-between ${
                      isCurrentTurn
                        ? 'bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500/20'
                        : 'bg-white/5 border-white/10/80 hover:border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono ${
                        isCurrentTurn ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-zinc-500'
                      }`}>
                        {c.initiative}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {c.name}
                          {c.isMonster && (
                            <span className="text-[9px] px-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded">NPC</span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-500 flex items-center gap-2 mt-0.5 font-mono">
                          <span>CA: <strong className="text-slate-300">{c.ac}</strong></span>
                          <span>• HP: <strong className="text-emerald-400">{c.hp}/{c.maxHp}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Adjust HP or delete for GM */}
                    <div className="flex items-center gap-2">
                      {isGm && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleAdjustMonsterHp(c.id, -1)}
                            className="px-1.5 py-0.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 rounded text-[10px] cursor-pointer"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleAdjustMonsterHp(c.id, 1)}
                            className="px-1.5 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 rounded text-[10px] cursor-pointer"
                          >
                            +1
                          </button>
                        </div>
                      )}
                      {isGm && (
                        <button
                          onClick={() => handleRemoveCombatant(c.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition cursor-pointer"
                          title="Remover da ordem"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: GM controls to add custom combatant */}
        {isGm && (
          <div className="bg-white/5 p-4  border border-white/10/80 space-y-4 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-2">Adicionar Oponente (NPC)</h3>
            <form onSubmit={handleAddMonster} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Nome do Monstro/Ameaça</label>
                <input
                  type="text"
                  placeholder="Ex: Chefe Orc, Armadilha..."
                  value={customMonsterName}
                  onChange={e => setCustomMonsterName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">HP Máx</label>
                  <input
                    type="number"
                    value={customMonsterHp}
                    onChange={e => setCustomMonsterHp(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">C.A.</label>
                  <input
                    type="number"
                    value={customMonsterAc}
                    onChange={e => setCustomMonsterAc(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Iniciativa</label>
                  <input
                    type="number"
                    value={customMonsterInit}
                    onChange={e => setCustomMonsterInit(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold  transition text-xs cursor-pointer"
              >
                <Plus size={14} /> Adicionar à Fila
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
