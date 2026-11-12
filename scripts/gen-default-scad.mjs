// Gera src/state/default-scad.ts a partir de ornamentos/ornamentos_redondos.scad
// (o modelo que abre por defeito no site). Corre antes do build.
import fs from 'node:fs';
const src = fs.readFileSync('ornamentos/ornamentos_redondos.scad', 'utf-8');
const esc = src.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
fs.writeFileSync('src/state/default-scad.ts',
  '// GERADO por scripts/gen-default-scad.mjs a partir de ornamentos/ornamentos_redondos.scad — não editar à mão.\n' +
  'export default `' + esc + '`;\n');
console.log('default-scad.ts gerado (' + src.length + ' caracteres)');
