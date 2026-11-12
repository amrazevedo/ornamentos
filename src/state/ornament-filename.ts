// Nome automático dos ficheiros exportados: <design>_<nome>_<parte>
// (ex.: coroa_Beatriz_base.stl). Só se aplica quando o modelo tem os
// parâmetros "design" e "nome" no Customizer (ornamentos_redondos.scad);
// nos outros modelos fica o nome original.
import type { State } from './app-state.ts';

const PRETTY_DESIGN: Record<string, string> = { sino_f: 'sino' };

function clean(s: string): string {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // Tomás → Tomas
    .replace(/[^A-Za-z0-9-]+/g, '-')                     // espaços e símbolos → -
    .replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export function ornamentStem(state: State): string | undefined {
  const params = state.parameterSet?.parameters ?? [];
  const get = (name: string): unknown =>
    state.params.vars?.[name] ?? (params.find(p => p.name === name) as any)?.initial;
  const design = get('design');
  const nome = get('nome');
  if (typeof design !== 'string' || typeof nome !== 'string') return undefined;
  const parte = get('parte');
  const d = clean(PRETTY_DESIGN[design] ?? design);
  const n = clean(nome) || 'sem-nome';
  const p = clean(typeof parte === 'string' ? parte : 'tudo') || 'tudo';
  return `${d}_${n}_${p}`;
}

/** Troca o nome-base de `fileName` (mantém a extensão) quando o modelo é um ornamento. */
export function ornamentFileName(state: State, fileName: string): string {
  const stem = ornamentStem(state);
  if (!stem) return fileName;
  const m = /\.([A-Za-z0-9]+)$/.exec(fileName);
  return m ? `${stem}.${m[1].toLowerCase()}` : stem;
}
