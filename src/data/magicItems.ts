import { MagicItem } from '../types';

export const magicItemsDb: MagicItem[] = [
  // --- D&D 5e ---
  {
    id: 'dd-1',
    name: 'Bag of Holding',
    system: 'D&D 5e',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. Retrieving an item from the bag requires an action.',
    properties: ['Storage', 'Dimensional']
  },
  {
    id: 'dd-2',
    name: 'Flame Tongue Longsword',
    system: 'D&D 5e',
    type: 'Weapon (Longsword)',
    rarity: 'Rare',
    attunement: true,
    description: 'You can use a bonus action to speak this magic weapon\'s command word, causing flames to erupt from the blade. These flames shed bright light in a 40-foot radius and dim light for an additional 40 feet. While the sword is ablaze, it deals an extra 2d6 fire damage to any target it hits.',
    properties: ['Damage Bonus', 'Fire Damage', 'Light Source']
  },
  {
    id: 'dd-3',
    name: 'Cloak of Protection',
    system: 'D&D 5e',
    type: 'Wondrous Item (Cloak)',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While wearing this cloak, you gain a +1 bonus to Armor Class and Saving Throws.',
    properties: ['AC Bonus', 'Saving Throw Bonus']
  },
  {
    id: 'dd-4',
    name: 'Boots of Elvenkind',
    system: 'D&D 5e',
    type: 'Wondrous Item (Boots)',
    rarity: 'Uncommon',
    attunement: false,
    description: 'While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have advantage on Dexterity (Stealth) checks that rely on moving silently.',
    properties: ['Stealth Advantage', 'Silent Movement']
  },
  {
    id: 'dd-5',
    name: 'Staff of Power',
    system: 'D&D 5e',
    type: 'Staff',
    rarity: 'Very Rare',
    attunement: true,
    description: 'This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls, AC, and saving throws. It has 20 charges and regains 2d8 + 4 charges daily. It can be used to cast spells like Cone of Cold, Fireball, Globe of Invulnerability, Lightning Bolt, and Magic Missile.',
    properties: ['Spellcasting Support', 'AC Bonus', 'Attack Bonus']
  },
  {
    id: 'dd-6',
    name: 'Deck of Many Things',
    system: 'D&D 5e',
    type: 'Wondrous Item',
    rarity: 'Legendary',
    attunement: false,
    description: 'A deck of 22 cards. Before you draw a card, you must declare how many cards you intend to draw. Any cards drawn in excess of this number have no effect. Each card has a profound magical effect, which can be highly beneficial or disastrously destructive.',
    properties: ['Chaotic', 'Game Changer']
  },

  // --- Pathfinder 2e ---
  {
    id: 'pf-1',
    name: 'Healer\'s Gloves',
    system: 'Pathfinder 2e',
    type: 'Invested Item (Gloves)',
    rarity: 'Common',
    attunement: true,
    description: 'These white leather gloves stay remarkably clean. They grant you a +1 item bonus to Medicine checks. Activate (1 action): You touch a living creature and heal it for 2d6+7 HP. You cannot activate this again until the next daily preparations.',
    properties: ['Medicine Bonus', 'Active Healing']
  },
  {
    id: 'pf-2',
    name: 'Wayfinder',
    system: 'Pathfinder 2e',
    type: 'Compass',
    rarity: 'Uncommon',
    attunement: false,
    description: 'A Wayfinder is a compact magical compass favored by members of the Pathfinder Society. It acts as a compass, can cast the Light cantrip, and has a socket that can hold a single Aeon Stone to grant its owner its benefits.',
    properties: ['Utility', 'Compass', 'Light Cantrip']
  },
  {
    id: 'pf-3',
    name: 'Ring of Doubling',
    system: 'Pathfinder 2e',
    type: 'Ring',
    rarity: 'Common',
    attunement: true,
    description: 'When you wield a melee weapon in the hand wearing this ring, any runes on that weapon are copied onto a second one-handed melee weapon you wield in your other hand. This allows you to share potency and striking runes across dual weapons.',
    properties: ['Dual Wielding', 'Rune Copying']
  },
  {
    id: 'pf-4',
    name: 'Staff of Fire',
    system: 'Pathfinder 2e',
    type: 'Staff',
    rarity: 'Common',
    attunement: true,
    description: 'Fitted with a ruby at the crown, this staff grants bonuses to fire spellcasting. Spells stored include Produce Flame, Burning Hands, and Fireball. Prepared casters can expend spell slots to add charges to the staff.',
    properties: ['Fire Spells', 'Evocation Support']
  },

  // --- Tormenta20 ---
  {
    id: 't20-1',
    name: 'Espada de Valkaria',
    system: 'Tormenta20',
    type: 'Arma (Espada Longa)',
    rarity: 'Único',
    attunement: true,
    description: 'Uma espada abençoada pela própria Deusa da Ambição. Concede +2 em testes de ataque e rolagens de dano. Quando o usuário enfrenta um oponente com ND (Nível de Desafio) superior ao seu próprio nível, o bônus aumenta para +5 de ataque e dano, além de permitir re-rolar um teste de ataque por rodada.',
    properties: ['Bônus contra Chefes', 'Re-rolagem']
  },
  {
    id: 't20-2',
    name: 'Medalhão de Lena',
    system: 'Tormenta20',
    type: 'Acessório (Colar)',
    rarity: 'Raro',
    attunement: true,
    description: 'Abençoado pela deusa da vida. Qualquer magia de cura conjurada pelo portador cura +2 PV adicionais por dado de cura. Além disso, uma vez por dia, o portador pode gastar 3 PM para remover uma condição negativa (envenenado, paralisado ou cego) de um aliado adjacente.',
    properties: ['Cura Aprimorada', 'Remover Condições']
  },
  {
    id: 't20-3',
    name: 'Manto de Tenebra',
    system: 'Tormenta20',
    type: 'Vestuário (Capa)',
    rarity: 'Raro',
    attunement: true,
    description: 'Tecido com a própria escuridão. Concede Camuflagem Leve (+20% de chance de erro em ataques à distância) e +5 em testes de Furtividade. Quando em escuridão completa, concede Camuflagem Total (50% de chance de erro) e permite teletransportar-se pelas sombras como uma ação de movimento (alcance curto, custa 2 PM).',
    properties: ['Furtividade', 'Teletransporte Sombrio']
  },

  // --- Call of Cthulhu ---
  {
    id: 'coc-1',
    name: 'The Eltdown Shards',
    system: 'Call of Cthulhu',
    type: 'Tome / Artifact',
    rarity: 'Very Rare',
    attunement: false,
    description: 'Mysterious clay shards inscribed with pre-human runes, found in Wiltshire. Reading them increases Cthulhu Mythos score by +8%, but costs 1d10 Sanity points. Contains secrets of the Great Race of Yith and ancient pre-human civilizations.',
    properties: ['Mythos Knowledge', 'Sanity Loss']
  },
  {
    id: 'coc-2',
    name: 'Amulet of the Elder Sign',
    system: 'Call of Cthulhu',
    type: 'Amulet',
    rarity: 'Extremely Rare',
    attunement: false,
    description: 'An ancient stone or lead disk carved with the five-pointed star and eye symbol (the Elder Sign). When hung near a doorway or worn, it wards off many active entities of the Mythos, preventing them from crossing or manifesting in the immediate vicinity.',
    properties: ['Protection', 'Warding Symbol']
  },
  {
    id: 'coc-3',
    name: 'Golden Mead of the Outer Gods',
    system: 'Call of Cthulhu',
    type: 'Elixir',
    rarity: 'Rare',
    attunement: false,
    description: 'A celestial golden liquid brewed by the servants of the Outer Gods. Drinking it permits the human consciousness to travel safely through interplanetary or interstellar space without a physical body. Requires a Sanity test on ingestion (1d4/1d10 loss).',
    properties: ['Astral Travel', 'Sanity Cost']
  },

  // --- Cyberpunk RED ---
  {
    id: 'cbr-1',
    name: 'Cyberdeck "Militech Paraline"',
    system: 'Cyberpunk RED',
    type: 'Cyberdeck',
    rarity: 'Incomum',
    attunement: false,
    description: 'Um deck robusto de nível de entrada com slots razoáveis. Aumenta a velocidade de conexão e estabilidade de programas em redes básicas.',
    properties: ['+1 Interface', '5 Slots']
  },
  {
    id: 'cbr-2',
    name: 'Sandevistan "Speedware"',
    system: 'Cyberpunk RED',
    type: 'Cyberware',
    rarity: 'Raro',
    attunement: true,
    description: 'Sistema nervoso central otimizado. Ao ser ativado como uma Ação, concede +3 na Iniciativa e a capacidade de realizar ações bônus de movimento durante o turno por 1 minuto. Perda massiva de Humanidade.',
    properties: ['+3 Iniciativa', 'Movimento Adicional', 'Perda de Humanidade']
  },
  // --- Vampire: Masquerade 5e ---
  {
    id: 'v5-1',
    name: 'Anel de Daywalking',
    system: 'Vampire: Masquerade 5e',
    type: 'Artefato',
    rarity: 'Extremamente Raro',
    attunement: true,
    description: 'Um anel antigo de ouro, encrustado com uma joia de sangue. Permite ao vampiro resistir aos efeitos nocivos da luz solar em dias nublados ou durante exposições breves, mitigando o Dano Agravado pela metade.',
    properties: ['Mitigação de Luz Solar', 'Relíquia']
  },
  // --- Ordem Paranormal ---
  {
    id: 'op-1',
    name: 'Pistola de Energia "Pulso"',
    system: 'Ordem Paranormal',
    type: 'Arma de Fogo',
    rarity: 'Raro',
    attunement: true,
    description: 'Uma arma de fogo modificada com sigilos do elemento Energia. Dispara feixes caóticos. Causa +1d6 de dano de Energia extra e ignora Resistência a Balístico.',
    properties: ['Dano de Energia', 'Tecnologia Paranormal']
  },
  {
    id: 'op-2',
    name: 'Relógio do Tempo Cárnico',
    system: 'Ordem Paranormal',
    type: 'Item Paranormal (Morte)',
    rarity: 'Especial',
    attunement: true,
    description: 'Um relógio de bolso que exala cheiro de terra molhada. Como uma ação, o usuário pode voltar no tempo exatos 6 segundos (1 turno) antes de uma rolagem ser feita. Custa 3 PE e 1d4 de Sanidade cada vez.',
    properties: ['Manipulação Temporal', 'Custo de PE/Sanidade']
  },
  // --- Starfinder ---
  {
    id: 'sf-1',
    name: 'Plasma Sword, Tactical',
    system: 'Starfinder',
    type: 'Advanced Melee Weapon',
    rarity: 'Rare',
    attunement: false,
    description: 'A hilt that generates a contained beam of superheated plasma. Deals 1d8 E & F damage. Has the target property (EAC) and ignores hardness less than 10.',
    properties: ['Energy Damage', 'Ignores Hardness']
  }

];
