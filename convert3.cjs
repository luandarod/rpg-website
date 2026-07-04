const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const subsystemRegex = /\{\(SYSTEM_VERSIONS\[selectedSystems\[0\]\] \|\| \[\]\)\.map\(\(ver\) => \(\s*<option key=\{ver\} value=\{ver\}>\{ver\}<\/option>\s*\)\)\}/;
const replacement = `{selectedSystems.flatMap(sys => SYSTEM_VERSIONS[sys] || []).map((ver) => (
                        <option key={ver} value={ver}>{ver}</option>
                      ))}`;

code = code.replace(subsystemRegex, replacement);

fs.writeFileSync('src/App.tsx', code);
