const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix handleSystemChange
code = code.replace(/const handleSystemChange = \(system: RPGSystem\) => \{\n    setSelectedSystem\(system\);\n    const defaultVer = SYSTEM_VERSIONS\[system\]\?\.\[0\] \|\| '';\n    setCharacterSubsystem\(defaultVer\);\n  \};/, 
  `const handleSystemChange = (system: string) => {
    if (selectedSystems.includes(system)) {
      if (selectedSystems.length > 1) {
        setSelectedSystems(selectedSystems.filter(s => s !== system));
      }
    } else {
      setSelectedSystems([...selectedSystems, system]);
    }
  };`);

// The select field in the UI for Character & Campaign Creation:
// We need to find the <select value={selectedSystems[0]} ... > and replace it with a multi-select.
const selectRegex = /<select\s+value=\{selectedSystems\[0\]\}\s+onChange=\{\(e\) => handleSystemChange\(e\.target\.value as RPGSystem\)\}\s+className="[^"]+"\s*>[\s\S]*?<\/select>/;

const multiSelectUI = `<div className="flex flex-wrap gap-2">
                      {Object.keys(SYSTEM_VERSIONS).map((sys) => {
                        const isSelected = selectedSystems.includes(sys);
                        return (
                          <button
                            type="button"
                            key={sys}
                            onClick={() => handleSystemChange(sys)}
                            className={\`px-3 py-1.5 rounded-sm border text-[10px] font-mono tracking-widest uppercase transition cursor-pointer \${
                              isSelected
                                ? 'bg-white/10 border-white text-white font-bold'
                                : 'bg-transparent border-white/10 hover:bg-white/5 text-zinc-500'
                            }\`}
                          >
                            {sys}
                          </button>
                        );
                      })}
                    </div>`;

code = code.replace(selectRegex, multiSelectUI);

fs.writeFileSync('src/App.tsx', code);
