# Ornamentos de Natal — OpenSCAD no browser

Fork do [OpenSCAD Playground](https://github.com/openscad/openscad-playground) (GPL) que abre direto no
`ornamentos/ornamentos_redondos.scad`, com o Customizer à vista e as fontes cursivas já incluídas.

## O que muda em relação ao Playground original
- **Modelo por defeito:** `ornamentos/ornamentos_redondos.scad`. O script `scripts/gen-default-scad.mjs` gera `src/state/default-scad.ts` em cada build.
- **Fontes:** Pacifico, Satisfy, Dancing Script, Lobster, Grand Hotel, Damion, Cookie, Norican e Yellowtail vêm de `ornamentos/fontes/` e são juntas ao `fonts.zip`.
- **Nome automático dos ficheiros exportados:** `design_nome_parte.ext`, por exemplo `coroa_Beatriz_base.stl` ou `bengala_Maria-Ines_nome.stl`. Os acentos são removidos e os espaços passam a `-`. O código está em `src/state/ornament-filename.ts`.
- **Interface:** abre com Customizer + vista 3D. O editor está no botão *Edit*.

## Publicar no GitHub Pages (uma vez)
1. Cria um repositório no GitHub, por exemplo `ornamentos`. Pode ser público.
2. Descompacta o zip e, dentro da pasta `ornamentos-web`, corre:
   ```bash
   git init -b main
   git add -A
   git commit -m "Ornamentos de Natal"
   git remote add origin https://github.com/<utilizador>/ornamentos.git
   git push -u origin main
   ```
3. No GitHub, vai a **Settings ▸ Pages ▸ Build and deployment ▸ Source** e escolhe **GitHub Actions**.
4. O workflow `.github/workflows/pages.yml` compila e publica. O 1.º build demora ~10 min, porque descarrega o OpenSCAD WASM e as bibliotecas; os seguintes usam cache.
5. O site fica em `https://<utilizador>.github.io/ornamentos/`.

## Atualizar designs
Edita `ornamentos/ornamentos_redondos.scad`, faz commit e push. O site atualiza sozinho.

## Molduras importadas (Levnur)
**Não as ponhas no repositório.** São só para uso pessoal e o site é público.

No site:
1. Carrega em **Edit ▸ ☰ ▸ Upload file(s)**.
2. Escolhe o teu `molduras_importadas.scad`.

O ficheiro fica só no teu browser, e os designs "Importado" passam a funcionar. Sem ele, o OpenSCAD mostra um aviso de *include* em falta e esses designs saem só com o nome.

## Exportar
- **STL:** muda `parte` para `base`, carrega em Render e depois em Download; repete com `parte` = `nome`.
- **3MF a 2 cores num só ficheiro:** deixa `parte = tudo`, escolhe 3MF na seta do botão Download e indica as 2 cores.

## Testar localmente
```bash
npm ci
node scripts/gen-default-scad.mjs
npm run build:libs   # descarrega o WASM, as fontes e as bibliotecas (precisa de internet)
npm run start        # http://localhost:4000/
```
