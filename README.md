# Terry React UI Library

Reusable React/TypeScript UI components with the Legacy Classic visual system.

The repository has two explicit products:

- **Library package** — built with Vite library mode into `dist/`, including ESM JavaScript, TypeScript declarations and bundled CSS.
- **Showcase site** — built separately into `site-dist/` and deployed to GitHub Pages.

## Install / consume

The package can be consumed from GitHub or, later, from a package registry. React is a peer dependency, so the host application owns the React runtime.

```ts
import {
  BoolSwitch,
  Button,
  Dialog,
  EntityHeader,
  MultiSelect,
  Select,
  Slider,
  TextField,
} from "terry-react-ui-library";
```

The generated `dist/index.js` imports `dist/style.css`, so existing consumers keep the one-import experience. `terry-react-ui-library/style.css` is also exported for hosts that prefer an explicit stylesheet import.

## Package layout

```text
src/
  index.ts                 public source entry
  components/              canonical component implementations
    BoolSwitch/
      BoolSwitch.tsx
      index.ts
    Select/
      Select.tsx
      index.ts
    TextField/
    Slider/
    Dialog/
    Button/
    EntityHeader/
    MultiSelect/
    ...
  styles/legacy-classic/   theme, motion and component visual CSS
    register.ts            single style-pack registration entry
scripts/
  finalize-library.mjs     verifies/finalizes dist CSS and compatibility assets
vite.config.lib.ts         library build
vite.config.ts             showcase build
tsconfig.lib.json          declaration build

dist/                      generated package artifact (not committed)
site-dist/                 generated showcase artifact (not committed)
```

`src/components/` is now both the public module boundary and the canonical implementation location. `src/styles/legacy-classic/components.tsx` and `visual-multi-select.tsx` remain only as source compatibility shims; new implementation code must not be added there.

## Build

```bash
npm run typecheck
npm run build:lib
npm run build:showcase
npm run build
```

`npm run build:lib` produces and verifies:

```text
dist/
  index.js
  index.d.ts
  style.css
  legacy-classic/
    theme.css
    theme-system.css
```

A Git dependency runs `prepare`, so consumers receive the generated `dist` package rather than compiling raw TypeScript source themselves.

## Dependency contract

- `react` and `react-dom` are **peerDependencies**. The consuming application owns the React runtime.
- `lucide-react` remains a normal runtime dependency because components use its icons internally.
- The package export map points consumers at `dist`, not `src`.
- CSS is marked as a side effect so bundlers must not tree-shake component styling away.
- CI installs the current Git SHA into a clean temporary Vite consumer and builds it; this protects the same install path used by Rulesmd Editor.

## Theme / style ownership

Legacy Classic exposes its visual color system through CSS variables. Component React code owns behavior and semantic DOM; the style pack owns the visual CSS. Consumers should customize public variables rather than targeting component internals.

Primary public channels include:

- `--tc-base`
- `--tc-accent`
- `--tc-effect`
- `--tc-text-main`
- `--tc-text-bright`

The single style registration entry is `src/styles/legacy-classic/register.ts`. New Legacy Classic CSS must be registered there instead of being imported ad hoc by arbitrary component files.

## Component boundary rules

- Product CSS must not reach into component implementation DOM to correct geometry.
- Components own their internal margin, padding, line-height, track/knob geometry and motion.
- Consumers may size and place documented outer hosts / public props only.
- A component bug must be fixed here and verified in the showcase before a product adds a workaround.
- Broad consumer selectors such as `.panel span`, `.row button` or `.dialog input` are unsafe around shared components.
- New component behavior belongs under `src/components/<Component>/`; new visual rules belong in the active style pack.

The BoolSwitch / Select cascade incident in Rulesmd Editor is the reference red-line case for these rules.

## Compatibility

Package consumers use the standard `dist` export map. Source compatibility entries under `src/styles/legacy-classic/` are kept only so repository-local tooling and older source imports do not break during the migration.

Existing component names and public props are intentionally preserved.
