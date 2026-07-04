import React, { useState } from 'react';
import { Skull, Zap, User, Box, Sparkles, RefreshCw, Dices, Target, Map, BookOpen } from 'lucide-react';

export default function GMTools() {
  const [activeTool, setActiveTool] = useState<'npc' | 'loot' | 'plot' | 'names' | 'lore' | 'encounter' | 'traps' | 'weather'>('names');
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states
  const [npcTheme, setNpcTheme] = useState('Fantasia Clássica');
  const [lootLevel, setLootLevel] = useState('Baixo');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedOutput('');

    setTimeout(() => {
      
      let result = '';
      if (activeTool === 'names') {
        const first = ['Kael', 'Zor', 'Jax', 'Vex', 'Rin', 'Nyx', 'Kaelen', 'Zephyr', 'Thane', 'Elara', 'Lyra', 'Seraphina', 'Valerius', 'Vex\'ahlia', 'Vax\'ildan', 'Percy', 'Keyleth', 'Pike', 'Scanlan', 'Grog', 'Taryon', 'Caleb', 'Beau', 'Fjord', 'Jester', 'Nott', 'Mollymauk', 'Caduceus', 'Yasha', 'Imogen', 'Laudna', 'Ashton', 'FCG', 'Orym', 'Fearne', 'Dorian', 'Chetney'];
        const last = ['Stormcaller', 'Ironfist', 'Shadowbane', 'Fireforge', 'Voidwalker', 'Dawnstrider', 'Nightwhisper', 'Bloodmoon', 'Vessar', 'De Rolo', 'Trickfoot', 'Shorthalt', 'Strongjaw', 'Darrington', 'Widogast', 'Lionett', 'Stone', 'Lavorre', 'Brenatto', 'Tealeaf', 'Clay', 'Nydoorin', 'Temult'];
        result = `1. ${first[Math.floor(Math.random()*first.length)]} ${last[Math.floor(Math.random()*last.length)]}
2. ${first[Math.floor(Math.random()*first.length)]}
3. ${first[Math.floor(Math.random()*first.length)]} ${last[Math.floor(Math.random()*last.length)]}
4. ${first[Math.floor(Math.random()*first.length)]} ${last[Math.floor(Math.random()*last.length)]}
5. ${first[Math.floor(Math.random()*first.length)]}`;
      } else if (activeTool === 'npc') {
        const npcs = [
          `**Nome:** Gilmore, o Glorioso (Mercador)\n**Aparência:** Roupas de seda, sorridente, rodeado de aromas agradáveis.\n**Segredo:** Um feitiçoeiro extremamente poderoso, patrocinador de heróis.\n**Motivação:** Lucro e proteger Emon.`,
          `**Nome:** Pumat Sol (Mercador Firbolg)\n**Aparência:** Alto, peludo, calmo, com cópias mágicas de si mesmo.\n**Segredo:** É servo de uma entidade ancestral.\n**Motivação:** Criar e vender itens mágicos.`,
          `**Nome:** Victor, o Vendedor de Pólvora\n**Aparência:** Falta de dedos, rosto chamuscado, caolho, errático.\n**Segredo:** Sabe a fórmula da pólvora negra melhor que qualquer corporação.\n**Motivação:** EXPLOSÕES!`,
          `**Nome:** Varek, o Silencioso\n**Aparência:** Alto, capuz negro, cicatriz no olho direito.\n**Personalidade:** Paranoico, sempre verifica as saídas.\n**Segredo:** Trabalha para a Guilda dos Ladrões secretamente.\n**Motivação:** Pagar a dívida de sangue de seu irmão.`,
          `**Nome:** Essek Thelyss\n**Aparência:** Drow de manto flutuante, olhar severo mas intrigado.\n**Segredo:** Roubou o Dodecaedro e o deu ao Império.\n**Motivação:** Aprender sobre a Dunamancia e fugir das consequências.`
        ];
        result = npcs[Math.floor(Math.random() * npcs.length)];
      } else if (activeTool === 'loot') {
        const loots = [
          `1. 450 Moedas de Ouro / Créditos\n2. 1x Poção de Cura Maior (Cura 4d4+4)\n3. Adaga de Ferro Frio (+1 vs Fadas / Mutações)\n4. Diário rasgado com coordenadas de um tesouro.`,
          `1. 2000 Moedas de Platina\n2. Manto da Deslocação (Ataques têm desvantagem)\n3. Gema da Alma contendo um diabo preso.\n4. Espada Longa Flamejante, forjada em Tal'Dorei.`,
          `1. 50 Moedas de Prata\n2. Pedaço de Resíduum (Pó de Vidro Verde, catalisador mágico fortíssimo)\n3. Relógio de Bolso quebrado (mas bate a cada hora perfeitamente).`,
          `1. Peças cibernéticas recuperadas (Qualidade Boa)\n2. Cartão de acesso nível 4 da Militech\n3. Jaqueta de Kevlar estilo Samurai\n4. 5.000 Eddies em um chip não rastreável.`
        ];
        result = loots[Math.floor(Math.random() * loots.length)];
      } else if (activeTool === 'plot') {
        const plots = [
          `**O Gancho:** O Conselho de Tal'Dorei foi infiltrado por Rakshasas e os heróis são incriminados.\n**O Desafio:** Fugir de Emon, buscar aliados em Whitestone e retornar.`,
          `**O Gancho:** Um artefato poderoso (um fragmento divino) foi roubado do museu principal.\n**O Twist:** O ladrão foi o próprio curador, tentando escondê-lo do culto da Morte.\n**O Desafio:** Os jogadores são contratados pelas autoridades, mas o curador tenta avisá-los do perigo.`,
          `**O Gancho:** Um estranho cubo místico foi escavado nas montanhas. Quem o toca, vê um futuro apocalíptico.\n**O Twist:** O cubo é a prisão de um ser antigo pedindo socorro.\n**O Desafio:** Decidir se devem abrir o cubo correndo o risco de libertar o fim do mundo.`,
          `**O Gancho:** Uma mega corporação está testando um novo neuro-vírus nos subúrbios.\n**O Twist:** Os executivos estão infectados pelo vírus que se tornou senciente.\n**O Desafio:** Invadir o servidor central e purgar a rede física e neural.`
        ];
        result = plots[Math.floor(Math.random() * plots.length)];
      } else if (activeTool === 'lore') {
        const lores = [
          `**A Queda de Aethelgard:**\nHá três séculos, a grande cidade flutuante de Aethelgard despencou dos céus quando seu núcleo foi corrompido por um mago traidor. Hoje formam a "Cratera dos Lamentos", um local temido por aventureiros. Dizem que os espíritos ainda protegem os fragmentos do cristal original.`,
          `**A Divergência (Exandria):**\nO evento onde os Deuses foram banidos do plano material após a Guerra da Calamidade, separados por um Portão Divino. Magia pura é rara, e os mortais agora moldam seu próprio destino, embora vestígios das batalhas dos deuses ainda existam, como áreas de magia morta e titãs caídos.`,
          `**Os Acordos de Sangue (Vampire V5):**\nApós a Segunda Inquisição limpar Londres e Viena, as seitas vampíricas criaram um pacto não escrito de discrição absoluta. Quebrar a Máscara na era moderna é a morte final instantânea.`,
          `**A Quarta Guerra Corporativa (Cyberpunk):**\nMilitech e Arasaka entraram em guerra total, culminando em uma explosão nuclear no centro de Night City (ativada por Johnny Silverhand e a força de ataque). O céu ainda tem um tom avermelhado (O "Tempo Vermelho").`
        ];
        result = lores[Math.floor(Math.random() * lores.length)];
      } else if (activeTool === 'encounter') {
        const encs = [
          `**Cenário:** Ruas escuras e estreitas sob chuva ácida.\n**Ameaças:** 3x Capangas Cibernéticos, 1x Franco-Atirador.\n**Complicação:** Comboio de transporte civil no fogo cruzado.\n**Recompensa:** Dados de acesso corporativo.`,
          `**Cenário:** Caverna iluminada por fungos azuis.\n**Ameaças:** 1x Beholder (Tirano Ocular) com ferimentos graves de uma batalha anterior, protegido por 4 cultistas.\n**Complicação:** A sala está desmoronando a cada turno.\n**Recompensa:** A varinha do Beholder (Artefato Menor).`,
          `**Cenário:** Taverna da cidade durante o festival.\n**Ameaças:** 5x Valentões Bêbados, 1x Nobre com Guarda-Costas Golem.\n**Complicação:** Não podem usar magia letal sem atrair a guarda real.\n**Recompensa:** Respeito do submundo e ouro do nobre.`
        ];
        result = encs[Math.floor(Math.random() * encs.length)];
      } else if (activeTool === 'traps') {
        const traps = [
          `**Gatilho:** Piso de pressão no centro do corredor.\n**Efeito:** Setas venenosas disparam das paredes (Dano Perfurante + Veneno).\n**Desarme:** DC 14 de Ladinagem para travar o mecanismo.`,
          `**Gatilho:** Fio de tropeço invisível na escada.\n**Efeito:** Pedras rolam do teto, causando 4d10 de Esmagamento (Save de Destreza para metade).\n**Desarme:** DC 16 de Ladinagem e ferramentas.`,
          `**Gatilho:** Iniciar o download sem descriptografar (ICE Black).\n**Efeito:** O sistema sobrecarrega a rede neural do Netrunner (3d6 Dano Mental + Desconexão Forçada).\n**Desarme:** Rolar Interface e Quebra-Gelo.`
        ];
        result = traps[Math.floor(Math.random() * traps.length)];
      } else if (activeTool === 'weather') {
        const weather = [
          `**Clima Atual:** Tempestade de Cinzas vulcânicas ou Névoa Densa.\n**Efeito Mecânico:** Visibilidade reduzida à metade. -2 em testes de Percepção (visão). Viagens demoram 50% mais.`,
          `**Clima Atual:** Eclipse Solar Repentino.\n**Efeito Mecânico:** Magias divinas curam 1 ponto a menos por dado. Mortos-vivos têm vantagem em ataques.`,
          `**Clima Atual:** Chuva Ácida Intensa (Cyberpunk/Sci-Fi).\n**Efeito Mecânico:** Roupas comuns derretem em 10 minutos. 1 de dano corrosivo a cada minuto exposto sem proteção.`
        ];
        result = weather[Math.floor(Math.random() * weather.length)];
      }

      setGeneratedOutput(result);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="bg-black border border-white/10 p-8 shadow-2xl h-full flex flex-col md:flex-row gap-8">
      {/* Sidebar / Tools List */}
      <div className="w-full md:w-64 space-y-4 shrink-0 overflow-y-auto">
        <h2 className="text-xl font-display font-bold text-white tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
          <Zap size={20} className="text-amber-500" /> Utilitários
        </h2>

        <div className="space-y-2">
          {[
            { id: 'names', icon: Dices, label: 'Nomes' },
            { id: 'npc', icon: User, label: 'PdMs / NPCs' },
            { id: 'loot', icon: Box, label: 'Saque / Loot' },
            { id: 'plot', icon: BookOpen, label: 'Ganchos' },
            { id: 'lore', icon: Sparkles, label: 'Lore' },
            { id: 'encounter', icon: Skull, label: 'Encontros' },
            { id: 'traps', icon: Target, label: 'Armadilhas' },
            { id: 'weather', icon: Map, label: 'Clima' }
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`w-full flex items-center gap-3 p-3 text-xs font-mono font-bold tracking-widest uppercase border transition ${activeTool === tool.id ? 'bg-white/10 border-white text-white' : 'bg-black border-white/10 text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}
              >
                <Icon size={14} /> {tool.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-black border border-white/10 p-6 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <h3 className="text-sm font-display font-bold text-white tracking-widest uppercase border-b border-white/10 pb-3 mb-6">
          {activeTool === 'names' && 'Gerador Rápido de Nomes'}
          {activeTool === 'npc' && 'Criação de PdM (NPC)'}
          {activeTool === 'loot' && 'Tabelas de Saque'}
          {activeTool === 'plot' && 'Ganchos de Aventura'}
          {activeTool === 'lore' && 'Mitos e Lendas Locais'}
          {activeTool === 'encounter' && 'Encontros Aleatórios'}
          {activeTool === 'traps' && 'Gerador de Armadilhas'}
          {activeTool === 'weather' && 'Clima e Eventos'}
        </h3>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Tema / Bioma / Sistema</label>
            <input 
              type="text" 
              value={npcTheme} 
              onChange={(e) => setNpcTheme(e.target.value)} 
              className="w-full bg-black border border-white/20 p-2 text-xs font-mono text-white focus:border-white outline-none" 
            />
          </div>

          {activeTool === 'loot' && (
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Nível de Ameaça / Riqueza</label>
              <select 
                value={lootLevel} 
                onChange={(e) => setLootLevel(e.target.value)} 
                className="w-full bg-black border border-white/20 p-2 text-xs font-mono text-white focus:border-white outline-none"
              >
                <option value="Baixo">Baixo (Bandidos, Goblins)</option>
                <option value="Médio">Médio (Chefes Locais, Cofres)</option>
                <option value="Alto">Alto (Dragões, Corporações)</option>
                <option value="Lendário">Lendário (Artefatos, Cofres de CEO)</option>
              </select>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full md:w-auto self-start flex items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-zinc-200 transition font-mono font-bold text-xs tracking-widest uppercase cursor-pointer disabled:opacity-50 relative z-10 mb-8"
        >
          {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {isGenerating ? 'PROCESSANDO...' : 'EXECUTAR ROTINA'}
        </button>

        {/* Output Area */}
        <div className="flex-1 bg-black border border-white/10 p-6 overflow-y-auto custom-scrollbar relative z-10">
          {generatedOutput ? (
            <div className="text-xs font-mono text-zinc-300 leading-loose whitespace-pre-wrap tracking-wide">
              {generatedOutput}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-50 space-y-4">
              <Dices size={48} className="text-zinc-700" />
              <p className="text-[10px] font-mono tracking-widest uppercase">Aguardando parâmetros para compilação.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
