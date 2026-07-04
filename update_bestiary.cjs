const fs = require('fs');

const moreMonsters = `
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
];`;

let code = fs.readFileSync('src/components/BestiaryDb.tsx', 'utf-8');
code = code.replace(/id: 'm6',[\s\S]*?\}\n\];/, `id: 'm6',\n    name: 'Carniceiro Brujah',\n    system: 'Vampire: Masquerade 5e',\n    type: 'Vampiro',\n    cr: 'Ancião (Potência 3)',\n    description: 'Um vampiro brutal que resolve tudo com força esmagadora.',\n    stats: { hp: 8, ac: 0, speed: 'Normal' },\n    traits: ['Disciplina: Rapidez 2, Potência 3', 'Frenesi: Suscetível à raiva'],\n    actions: ['Soco Destruidor: +5 dados de dano físico', 'Fuga Sobrenatural: Ação extra de movimento']\n  },${moreMonsters}`);

fs.writeFileSync('src/components/BestiaryDb.tsx', code);
