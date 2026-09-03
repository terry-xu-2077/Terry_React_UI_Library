# Terry React UI Library

Reusable React/TypeScript UI styles maintained independently from any single product.

## Showcase

The repository root contains a single `index.html`. Run the Vite app to view the component showcase. Each visual style appears as a tab in the same showcase page.

```bash
npm install
npm run dev
```

## Style packs

- `src/styles/legacy-classic/` — visual language extracted from the earlier RulesmdEditorWeb UI. Visual details and motion are preserved while implementation and APIs are generalized.

Future styles should be added as sibling folders under `src/styles/` and registered as a new tab in `src/main.tsx`.

## Library rules

- Style packs must not depend on Rulesmd, Red Alert, INI, unit, faction or other product-specific concepts.
- Product-specific names belong in the consuming application.
- Preserve the intended visual identity and motion details of each style pack.
- Implementation bugs, brittle DOM code and business coupling should be fixed during extraction.
- The root showcase remains one page; new styles add tabs rather than separate HTML entry points.
