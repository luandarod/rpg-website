import React, { useState, useRef, useEffect } from 'react';
import { CampaignMap, MapMarker } from '../types';
import { Map, Pin, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface MapBoardProps {
  map: CampaignMap;
  isGm: boolean;
  onUpdateMap: (newMap: CampaignMap) => void;
}

const PRESET_MAPS = [
  { name: 'Masmorra Clássica', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&q=80' },
  { name: 'Floresta Sombria', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&q=80' },
  { name: 'Taverna do Dragão', url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&q=80' },
  { name: 'Deserto Hostil', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1000&q=80' }
];

const MARKER_COLORS = [
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Roxo', value: '#a855f7' },
  { name: 'Branco', value: '#ffffff' }
];

export default function MapBoard({ map, isGm, onUpdateMap }: MapBoardProps) {
  const [customUrl, setCustomUrl] = useState('');
  const [markerLabel, setMarkerLabel] = useState('');
  const [markerColor, setMarkerColor] = useState('#ef4444');
  const [markerType, setMarkerType] = useState<'character' | 'monster' | 'hazard' | 'loot' | 'custom'>('character');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isGm) return; // Only GM can place markers directly
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarker: MapMarker = {
      id: 'marker-' + Date.now().toString(36),
      label: markerLabel || 'Marcador',
      x,
      y,
      color: markerColor,
      type: markerType
    };

    onUpdateMap({
      ...map,
      markers: [...map.markers, newMarker]
    });

    setMarkerLabel(''); // Reset label
  };

  const handleRemoveMarker = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onUpdateMap({
      ...map,
      markers: map.markers.filter(m => m.id !== id)
    });
  };

  const handleUpdatePresetMap = (url: string) => {
    onUpdateMap({
      ...map,
      backgroundUrl: url
    });
  };

  const handleToggleGrid = () => {
    onUpdateMap({
      ...map,
      gridEnabled: !map.gridEnabled
    });
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onUpdateMap({
      ...map,
      backgroundUrl: customUrl.trim()
    });
    setCustomUrl('');
  };

  return (
    <div className="bg-black border border-white/10 shadow-2xl p-6 text-zinc-300 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Map className="text-indigo-400" size={20} />
          <h2 className="text-lg font-bold text-white">Mapa Tático Interativo</h2>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
            {isGm ? 'Modo Mestre (Edição)' : 'Modo Jogador (Visualização)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleGrid}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded border border-slate-700 transition cursor-pointer"
          >
            {map.gridEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
            Grelha / Grid
          </button>
        </div>
      </div>

      {isGm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4  border border-white/10 text-xs">
          {/* Preset maps and custom image */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider">Cenário do Mapa</h3>
            <div className="flex flex-wrap gap-2">
              {PRESET_MAPS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUpdatePresetMap(p.url)}
                  className={`px-2.5 py-1.5 rounded border text-[11px] font-semibold transition cursor-pointer ${
                    map.backgroundUrl === p.url
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-white/10 hover:bg-slate-800 text-zinc-500'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
              <input
                type="url"
                placeholder="URL de imagem customizada..."
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                className="flex-1 bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition cursor-pointer"
              >
                Aplicar
              </button>
            </form>
          </div>

          {/* Marker config */}
          <div className="space-y-3 border-t md:border-t-0 md:border-l border-white/10/60 md:pl-4">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider">Adicionar Token / Pin</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Nome/Etiqueta</label>
                <input
                  type="text"
                  placeholder="Ex: Guerreiro, Goblin..."
                  value={markerLabel}
                  onChange={e => setMarkerLabel(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Tipo de Token</label>
                <select
                  value={markerType}
                  onChange={e => setMarkerType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="character">Jogador</option>
                  <option value="monster">Inimigo</option>
                  <option value="hazard">Perigo</option>
                  <option value="loot">Tesouro</option>
                  <option value="custom">Outro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Cor</label>
              <div className="flex gap-1.5">
                {MARKER_COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setMarkerColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-5 h-5 rounded-full border transition cursor-pointer ${
                      markerColor === c.value ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/20' : 'border-transparent'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Board Stage */}
      <div className="relative border border-white/10  overflow-hidden bg-white/5">
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          className="relative aspect-video w-full bg-cover bg-center transition-all cursor-crosshair select-none"
          style={{ backgroundImage: `url(${map.backgroundUrl})` }}
        >
          {/* Overlay grid if enabled */}
          {map.gridEnabled && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)',
                backgroundSize: '4% 7.1%', // approx ratio for 16:9 grid layout
              }}
            />
          )}

          {/* Markers / Tokens */}
          {map.markers.map(m => {
            let markerBg = 'bg-indigo-600';
            if (m.type === 'monster') markerBg = 'bg-rose-600';
            if (m.type === 'hazard') markerBg = 'bg-amber-600';
            if (m.type === 'loot') markerBg = 'bg-emerald-600';

            return (
              <div
                key={m.id}
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent duplicate placements
                }}
              >
                {/* Marker body */}
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-lg border-2 ring-4 ring-black/40`}
                  style={{ backgroundColor: m.color, borderColor: '#000000' }}
                >
                  {m.label.substring(0, 2).toUpperCase()}
                </div>

                {/* Floating tooltip/label */}
                <div className="mt-1 px-2 py-0.5 bg-white/5/90 text-[10px] font-bold text-white rounded border border-white/10/80 shadow whitespace-nowrap pointer-events-none">
                  {m.label}
                </div>

                {/* GM Quick Actions */}
                {isGm && (
                  <button
                    onClick={(e) => handleRemoveMarker(m.id, e)}
                    className="absolute -top-3 -right-3 p-1 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-md transition opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
        <span>Instruções: {isGm ? 'Clique em qualquer lugar do mapa para colocar seu Token configurado.' : 'O mestre administra e atualiza os pinos de batalha.'}</span>
        <span>Total de Tokens: {map.markers.length}</span>
      </div>
    </div>
  );
}
