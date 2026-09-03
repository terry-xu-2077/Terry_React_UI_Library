# Terry React UI Library

Reusable React/TypeScript UI styles maintained independently from any single product.

## Showcase

Open the GitHub Pages URL directly to inspect the components. The repository root contains a single `index.html`; each visual style appears as a tab in this same showcase page.

The root showcase is intentionally zero-build friendly so a branch-based GitHub Pages deployment can render it directly. The React/TypeScript source remains under `src/styles/` for real application use.

## Style packs

- `src/styles/legacy-classic/` — visual language extracted from the earlier RulesmdEditorWeb UI. Visual details and motion are preserved while implementation and APIs are generalized.

Future styles should be added as sibling folders under `src/styles/` and registered as a new showcase tab rather than creating another HTML entry point.

## Theme variable contract

A style pack must expose its visual color system through root CSS variables. Components must consume those variables instead of embedding product colors directly in component selectors.

Legacy Classic currently exposes variables including:

- `--tc-accent` / `--tc-accent-bright` / `--tc-accent-dark` — primary interactive tone.
- `--tc-glow` — hover/focus glow.
- `--tc-bg`, `--tc-surface`, `--tc-panel`, `--tc-panel-focus` — background hierarchy.
- `--tc-border-color`, `--tc-line`, `--tc-row-hover` — borders and interaction surfaces.
- `--tc-text`, `--tc-text-muted`, `--tc-text-accent` — typography colors.
- `--tc-good`, `--tc-warn`, `--tc-danger` — semantic status colors.
- `--tc-tooltip-bg`, `--tc-tooltip-text` — tooltip theme.
- `--tc-header-blue`, `--tc-header-red`, `--tc-header-purple`, `--tc-header-neutral` — optional header tone presets.

The showcase provides live color controls to verify that the whole component family reacts consistently to theme changes.

## Library rules

- Style packs must not depend on Rulesmd, Red Alert, INI, unit, faction or other product-specific concepts.
- Product-specific names belong in the consuming application.
- Preserve the intended visual identity and motion details of each style pack.
- Implementation bugs, brittle DOM code and business coupling should be fixed during extraction.
- The root showcase remains one page; new styles add tabs rather than separate HTML entry points.
- Component colors must come from style-pack theme variables. Hard-coded colors are allowed only for deliberately neutral physical details that are not part of the theme palette.
