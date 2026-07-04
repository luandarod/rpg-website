import React, { useState } from 'react';
import { Search, Skull, Shield, Swords, Zap, Crosshair } from 'lucide-react';

interface Monster {
  id: string;
  name: string;
  system: string;
  type: string;
  cr: string;
  description: string;
  stats: {
    hp: number;
    ac: number;
    speed: string;
  };
  traits: string[];
  actions: string[];
}

const bestiaryDb: Monster[] = [
  {
    id: 'm1',
    name: 'Goblin Salteador',
    system: 'D&D 5e',
    type: 'Humanoid',
    cr: '1/4',
    description: 'Pequenos humanoides cruéis que habitam cavernas e florestas escuras, sempre emboscando viajantes.',
    stats: { hp: 7, ac: 15, speed: '9m' },
    traits: ['Fuga Ágil: Pode Desengajar ou Esconder-se como ação bônus.'],
    actions: ['Cimitarra: +4 para acertar, dano 1d6+2', 'Arco Curto: +4 para acertar, dano 1d6+2']
  },
  {
    id: 'm2',
    name: 'Dragão Vermelho Adulto',
    system: 'D&D 5e',
    type: 'Dragon',
    cr: '17',
    description: 'Um tirano dos céus cuspindo chamas que reduzem armaduras e guerreiros a cinzas.',
    stats: { hp: 256, ac: 19, speed: '12m, Voo 24m' },
    traits: ['Resistência Lendária (3/dia)', 'Imunidade a Fogo'],
    actions: ['Sopro de Fogo: 18d6 fogo (cone 18m)', 'Mordida: +14 para acertar, 2d10+8 perfurante + 1d6 fogo']
  },
  {
    id: 'm3',
    name: 'Zumbi de Sangue',
    system: 'Ordem Paranormal',
    type: 'Criatura (Sangue)',
    cr: 'VD 20',
    description: 'Um cadáver reanimado por lodo vermelho e violência pura.',
    stats: { hp: 45, ac: 12, speed: '9m' },
    traits: ['Imunidade: Críticos e Dano Mental', 'Sentidos: Percepção às Cegas'],
    actions: ['Garras de Sangue: 2 ataques, 1d8+3', 'Agarrão Bestial: Pode agarrar como ação livre se acertar.']
  },
  {
    id: 'm4',
    name: 'Operativo Corporativo',
    system: 'Cyberpunk RED',
    type: 'Humano (Corporativo)',
    cr: 'Ameaça Média',
    description: 'Agentes táticos de campo armados com submetralhadoras e blindagem média.',
    stats: { hp: 35, ac: 11, speed: '6m' },
    traits: ['Treinamento Tático: +2 Iniciativa', 'Colete Balístico: Para 10 de dano'],
    actions: ['Rajada de SMG: 2d6 Dano, multiplicador de auto-fire', 'Granada de Luz: Cega oponentes por 1 turno']
  },
  {
    id: 'm5',
    name: 'Esqueleto Guardião',
    system: 'Pathfinder 2e',
    type: 'Undead',
    cr: '1',
    description: 'Restos animados em armadura enferrujada, patrulhando antigas tumbas.',
    stats: { hp: 16, ac: 16, speed: '7.5m' },
    traits: ['Imunidade: Sangramento, Veneno, Doença', 'Resistência: Cortante e Perfurante'],
    actions: ['Espada Longa: +7 para acertar, 1d8+3 cortante', 'Alçar Escudo: +2 AC']
  },
  {
    id: 'm6',
    name: 'Carniceiro Brujah',
    system: 'Vampire: Masquerade 5e',
    type: 'Vampiro',
    cr: 'Ancião (Potência 3)',
    description: 'Um vampiro brutal que resolve tudo com força esmagadora.',
    stats: { hp: 8, ac: 0, speed: 'Normal' },
    traits: ['Disciplina: Rapidez 2, Potência 3', 'Frenesi: Suscetível à raiva'],
    actions: ['Soco Destruidor: +5 dados de dano físico', 'Fuga Sobrenatural: Ação extra de movimento']
  },
  {
    id: 'm7',
    name: 'Vecna, O Sussurrado (Critical Role)',
    system: 'D&D 5e',
    type: 'Undead (Deity)',
    cr: '26',
    description: 'Deus dos segredos e necromancia. Arquimago lich que ascendeu à divindade, enfrentado pelo Vox Machina.',
    stats: { hp: 346, ac: 22, speed: '9m, Voo 12m' },
    traits: ['Divindade: Imune a magias de nível 5 ou menor.', 'Regeneração Sombria: Recupera 20 PV por turno.'],
    actions: ['Toque Paralisante: Dano Necrótico e Paralisia', 'Magias de Arquimago (Meteoro, Desejo)']
  },
  {
    id: 'm8',
    name: 'Tarrasque',
    system: 'D&D 5e',
    type: 'Monstrosity (Titan)',
    cr: '30',
    description: 'A máquina de destruição absoluta. Uma fera colossal de fome insaciável.',
    stats: { hp: 676, ac: 25, speed: '12m' },
    traits: ['Carapaça Reflexiva: Reflete magias de linha, projétil ou ataque de magia.', 'Resistência a Magia', 'Resistência Lendária (3/dia)'],
    actions: ['Mordida: +19 para acertar, 4d12+10 perfurante (Agarra)', 'Engolir', 'Garras, Chifres, Cauda']
  },
  {
    id: 'm9',
    name: 'Grog Strongjaw (NPC / Boss)',
    system: 'D&D 5e',
    type: 'Humanoid (Goliath)',
    cr: '18',
    description: 'Bárbaro Golias de inteligência limitada mas de força incomensurável.',
    stats: { hp: 280, ac: 17, speed: '12m' },
    traits: ['Fúria Implacável', 'Resistência de Golias'],
    actions: ['Machado Exaltado: +14 para acertar, 1d12+8 cortante + 1d6 extra', 'Frenesi']
  },
  {
    id: 'm10',
    name: 'Rovagug, O Destruidor',
    system: 'Pathfinder 2e',
    type: 'Deity',
    cr: '25',
    description: 'A besta que devora a criação. Uma divindade apocalíptica de fúria cega.',
    stats: { hp: 550, ac: 48, speed: '18m' },
    traits: ['Aura de Aniquilação', 'Imunidade Absoluta', 'Frenesi de Titã'],
    actions: ['Sopro do Vazio', 'Garras da Ruína']
  },
  {
    id: 'm11',
    name: 'Deus da Morte',
    system: 'Ordem Paranormal',
    type: 'Criatura (Morte)',
    cr: 'VD 300',
    description: 'A representação máxima do elemento Morte. O tempo para e a entropia reina onde ele pisa.',
    stats: { hp: 800, ac: 35, speed: '12m' },
    traits: ['Distorção Temporal: Tem 2 turnos inteiros por rodada.', 'Aura de Entropia: Criaturas num raio de 9m tomam dano de Morte passivamente.'],
    actions: ['Foice Temporal: Ignora armadura não-paranormal.', 'Toque do Envelhecimento']
  },
  {
    id: 'm12',
    name: 'Rei de Amarelo (Hastur)',
    system: 'Call of Cthulhu',
    type: 'Great Old One',
    cr: 'Desconhecido',
    description: 'Uma entidade inefável. Sua peça teatral leva à loucura e mutação.',
    stats: { hp: 'N/A', ac: 'N/A', speed: 'Incompreensível' },
    traits: ['Loucura Instatânea: Olhar para ele requer teste Sanidade (1d10/1d100)'],
    actions: ['Controlar Mente', 'Distorcer Realidade']
  },
  {
    id: 'm13',
    name: 'Cromathia',
    system: 'Tormenta20',
    type: 'Dragão Divino',
    cr: 'ND 20',
    description: 'A própria Rainha dos Dragões em Arton, uma ameaça ao Panteão.',
    stats: { hp: 1200, ac: 45, speed: '18m voo' },
    traits: ['Sopro Quíntuplo: 5 elementos ao mesmo tempo', 'Imunidades de Dragão'],
    actions: ['Ataque Total', 'Magias Épicas']
  },
  {
    id: 'm14',
    name: 'Adam Smasher',
    system: 'Cyberpunk RED',
    type: 'Ciborgue (Borg)',
    cr: 'Lendário',
    description: 'Mais máquina que homem. Um monstro corporativo da Arasaka, pesadelo de Night City.',
    stats: { hp: 85, ac: 15, speed: '15m (Sandevistan)' },
    traits: ['Sandevistan: Reflexos sobre-humanos.', 'Blindagem Dragão: Para 18 de dano'],
    actions: ['Canhão de Ombro: 6d6 explosivo.', 'Metralhadora Pesada', 'Esmagar Corpo-a-Corpo']
  }
];

export default function BestiaryDb() {
  const [searchQuery, setSearchQuery] = useState('');
  const [systemFilter, setSystemFilter] = useState<string>('All');

  const filteredMonsters = bestiaryDb.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSystem = systemFilter === 'All' || m.system === systemFilter;
    return matchesSearch && matchesSystem;
  });

  return (
    <div className="bg-black border border-white/10 p-6 text-zinc-300 shadow-xl h-full flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Skull className="text-red-500" size={20} />
          <h2 className="text-lg font-bold text-white uppercase tracking-widest">Bestiário Tático</h2>
        </div>
        <span className="text-xs font-mono text-zinc-500 font-medium">
          {filteredMonsters.length} registros confidenciais
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder="Buscar criatura por nome ou tipo..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-white transition"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['All', 'D&D 5e', 'Pathfinder 2e', 'Ordem Paranormal', 'Cyberpunk RED', 'Vampire: Masquerade 5e'].map((sys) => (
            <button
              key={sys}
              onClick={() => setSystemFilter(sys)}
              className={`px-3 py-1.5 rounded-sm border text-[10px] font-mono tracking-widest uppercase transition cursor-pointer ${
                systemFilter === sys
                  ? 'bg-white/10 border-white text-white font-bold'
                  : 'bg-transparent border-white/10 hover:bg-white/5 text-zinc-500'
              }`}
            >
              {sys === 'All' ? 'TODOS' : sys}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pb-10">
        {filteredMonsters.map(monster => (
          <div key={monster.id} className="bg-black border border-white/10 flex flex-col group hover:border-red-500/50 transition">
            <div className="p-4 border-b border-white/10 bg-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Skull size={48} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider relative z-10">{monster.name}</h3>
              <p className="text-[10px] font-mono text-red-400 relative z-10">{monster.system} &bull; {monster.type}</p>
            </div>
            
            <div className="p-4 space-y-4 flex-1">
              <div className="flex justify-between items-center bg-black border border-white/5 p-2 text-xs font-mono">
                <div className="text-center">
                  <span className="block text-[9px] text-zinc-500 uppercase">PV / HP</span>
                  <span className="font-bold text-green-400">{monster.stats.hp}</span>
                </div>
                <div className="text-center border-l border-white/5 pl-2">
                  <span className="block text-[9px] text-zinc-500 uppercase">Defesa</span>
                  <span className="font-bold text-blue-400">{monster.stats.ac}</span>
                </div>
                <div className="text-center border-l border-white/5 pl-2">
                  <span className="block text-[9px] text-zinc-500 uppercase">Ameaça / VD</span>
                  <span className="font-bold text-amber-400">{monster.cr}</span>
                </div>
                <div className="text-center border-l border-white/5 pl-2">
                  <span className="block text-[9px] text-zinc-500 uppercase">Deslocamento</span>
                  <span className="font-bold text-zinc-300">{monster.stats.speed}</span>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Shield size={12} className="text-zinc-500" /> Habilidades Passivas
                </h4>
                <ul className="text-[11px] text-zinc-400 space-y-1 font-mono">
                  {monster.traits.map((trait, i) => <li key={i}>&bull; {trait}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Swords size={12} className="text-zinc-500" /> Ações / Ataques
                </h4>
                <ul className="text-[11px] text-zinc-400 space-y-1 font-mono">
                  {monster.actions.map((action, i) => <li key={i}>&bull; {action}</li>)}
                </ul>
              </div>

              <div className="pt-2 border-t border-white/5 text-[10px] text-zinc-500 italic">
                "{monster.description}"
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
