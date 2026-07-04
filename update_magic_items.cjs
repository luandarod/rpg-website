const fs = require('fs');

const moreItems = `
  {
    id: 'i8',
    name: 'Vestiges of Divergence: Deathwalker\\'s Ward',
    system: 'D&D 5e',
    type: 'Armor (Studded Leather)',
    rarity: 'Legendary',
    attunement: true,
    description: 'Armadura forjada no campeão da Morte, concedida a Vax\\'ildan. No estágio Exaltado, concede vantagem contra feitiços mortais, permite voo (Asas de Corvo) e resistência a três tipos de dano (Fogo, Frio, Relâmpago, Necrótico ou Ácido, mudando com um descanso curto).',
    properties: ['+3 AC', 'Voo (Asas)', 'Vantagem Death Saves']
  },
  {
    id: 'i9',
    name: 'Vestiges of Divergence: Cabal\\'s Ruin',
    system: 'D&D 5e',
    type: 'Wondrous Item',
    rarity: 'Legendary',
    attunement: true,
    description: 'Uma capa absorvedora de magias usada por Percy. No estágio Exaltado, pode absorver magias que focam o usuário e liberar a energia armazenada como dano de força em um ataque armado.',
    properties: ['Absorve Magias (Max 10 Cargas)', '+1d6 Dano de Força por carga gasta']
  },
  {
    id: 'i10',
    name: 'Star Razor (Dwueth\\'var)',
    system: 'D&D 5e',
    type: 'Weapon (Longsword)',
    rarity: 'Legendary',
    attunement: true,
    description: 'Uma espada lendária do Império Antigo recuperada por Fjord. Brilha com luz estelar, permite conjurar magias como See Invisibility e Faerie Fire, além de causar dano radiante extra.',
    properties: ['+3 Hit/Damage', 'Radiant Damage (1d8)', 'Spellcasting (Faerie Fire, See Invisibility)']
  },
  {
    id: 'i11',
    name: 'Core of the Colossus',
    system: 'Starfinder',
    type: 'Artifact',
    rarity: 'Artifact',
    attunement: false,
    description: 'A bateria nuclear de um mecha titânico caído. Pode fornecer energia infinita para uma cidade ou causar uma explosão que rasga o espaço-tempo.',
    properties: ['Energia Ilimitada', 'Risco de Fusão (100d20 Dano em área de 50km)']
  },
  {
    id: 'i12',
    name: 'Máscara de Nyarlathotep',
    system: 'Call of Cthulhu',
    type: 'Relic',
    rarity: 'Único',
    attunement: false,
    description: 'Uma máscara de madeira petrificada que, quando colocada, concede ao usuário a capacidade de compreender todos os idiomas do universo, mas drena 1d6 de Sanidade permanente a cada uso.',
    properties: ['Omnilinguismo', 'Perda de Sanidade Permanente']
  }
];`;

let code = fs.readFileSync('src/components/MagicItemsDb.tsx', 'utf-8');
code = code.replace(/id: 'i7',[\s\S]*?\}\n\];/, `id: 'i7',\n    name: 'Black ICE (Killer)',\n    system: 'Cyberpunk RED',\n    type: 'Cyberdeck Program',\n    rarity: 'Rare',\n    attunement: false,\n    description: 'Um programa de quebra-gelo ofensivo altamente ilegal. Ele rastreia o Netrunner que o atacou e queima seus sinapses remotamente.',\n    properties: ['Dano de Interface +2d6', 'Letalidade Neural']\n  },${moreItems}`);

fs.writeFileSync('src/components/MagicItemsDb.tsx', code);
