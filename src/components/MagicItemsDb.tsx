import React, { useState } from 'react';
import { magicItemsDb } from '../data/magicItems';
import { Search, Sparkles, BookOpen, Layers, Star } from 'lucide-react';

export default function MagicItemsDb() {
  const [searchQuery, setSearchQuery] = useState('');
  const [systemFilter, setSystemFilter] = useState<string>('All');

  const filteredItems = magicItemsDb.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSystem = systemFilter === 'All' || item.system === systemFilter;
    
    return matchesSearch && matchesSystem;
  });

  return (
    <div className="bg-black border border-white/10 shadow-2xl p-6 text-zinc-300 shadow-xl space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" size={20} />
          <h2 className="text-lg font-bold text-white">Códice de Itens Mágicos</h2>
        </div>
        <span className="text-xs text-zinc-500 font-medium">
          {filteredItems.length} itens encontrados no compêndio
        </span>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Buscar por nome, tipo, runas ou palavras na descrição..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10  pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* System Filters */}
        <div className="flex flex-wrap gap-1.5">
          {['All', 'D&D 5e', 'Pathfinder 2e', 'Tormenta20', 'Call of Cthulhu', 'Cyberpunk RED', 'Vampire: Masquerade 5e', 'Ordem Paranormal', 'Starfinder'].map((sys) => (
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

      {/* Items Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white/5/40 border border-dashed border-white/10  p-12 text-center text-xs text-slate-500">
          Nenhum item mágico corresponde aos filtros aplicados. Tente alterar sua busca.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 p-4  border border-white/10/80 hover:border-indigo-500/30 transition flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Highlight background blob on hover */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/10 transition duration-300" />

              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition tracking-wide leading-snug">
                    {item.name}
                  </h3>
                  <span className="px-2 py-0.5 text-[9px] uppercase font-mono font-bold tracking-wider bg-slate-900 text-zinc-500 rounded-md border border-white/10">
                    {item.system}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                  <span className="text-amber-400 flex items-center gap-0.5">
                    <Star size={10} className="fill-amber-400/20" /> {item.rarity}
                  </span>
                  <span>•</span>
                  <span>{item.type}</span>
                  {item.attunement && (
                    <>
                      <span>•</span>
                      <span className="text-purple-400">Requer Sintonia/Sinc</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1.5 border-t border-slate-900">
                  {item.description}
                </p>
              </div>

              {/* Tags/Properties list */}
              {item.properties && item.properties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-900/40">
                  {item.properties.map((prop, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 text-[9px] bg-indigo-950/30 text-indigo-400 rounded font-semibold border border-indigo-900/10"
                    >
                      {prop}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
