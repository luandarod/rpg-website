const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/const \[selectedSystem, setSelectedSystem\] = useState<RPGSystem>\('D&D 5e'\);/, "const [selectedSystems, setSelectedSystems] = useState<string[]>(['D&D 5e']);");
code = code.replace(/system: selectedSystem,/g, "systems: selectedSystems,");
code = code.replace(/selectedSystem/g, "selectedSystems[0]");
code = code.replace(/selectedSystems\[0\]s/g, "selectedSystems"); // fix plural if needed

// Replace character/campaign systems displays
code = code.replace(/\{char\.system\.substring/g, "{char.systems.join(', ').substring");
code = code.replace(/c\.system\)/g, "c.systems.join(', '))");
code = code.replace(/\{camp\.system\}/g, "{camp.systems.join(', ')}");
code = code.replace(/\{activeCampaign\.system\} Campanha/g, "{activeCampaign.systems.join(', ')} Campanha");

fs.writeFileSync('src/App.tsx', code);
