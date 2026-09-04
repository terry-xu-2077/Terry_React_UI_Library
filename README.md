# Terry React UI Library

Reusable React/TypeScript UI components with the Legacy Classic visual system.

The repository now has two explicit products:

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
  components/              stable component-facing module tree
    BoolSwitch/
    Select/
    TextField/
    Slider/
    Dialog/
    Button/
    EntityHeader/
    MultiSelect/
    ...
  styles/legacy-classic/   Legacy Classic implementation + theme assets
scripts/
  finalize-library.mjs     final dist CSS wiring / compatibility assets
vite.config.lib.ts         library build
vite.config.ts             showcase build
tsconfig.lib.json          declaration build

dist/                      generated package artifact (not committed)
site-dist/                 generated showcase artifact (not committed)
```

The `components/` folders are the stable public module boundary. During this compatibility-preserving migration they re-export the proven Legacy Classic implementations; implementation files can now be split further without changing consumer imports.

## Build

```bash
npm run typecheck
npm run build:lib
npm run build:showcase
npm run build
```

`npm run build:lib` produces:

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

## Theme contract

Legacy Classic exposes its visual color system through CSS variables. Consumers should customize the documented public variables rather than targeting component internals.

Primary public channels include:

- `--tc-base`
- `--tc-accent`
- `--tc-effect`
- `--tc-text-main`
- `--tc-text-bright`

Derived surface, line, typography, status and header variables are maintained by the style pack.

## Component boundary rules

- Product CSS must not reach into component implementation DOM to correct geometry.
- Components own their internal margin, padding, line-height, track/knob geometry and motion.
- Consumers may size and place documented outer hosts / public props only.
- A component bug must be fixed here and verified in the showcase before a product adds a workaround.
- Broad consumer selectors such as `.panel span`, `.row button` or `.dialog input` are considered unsafe around shared components.

The BoolSwitch / Select cascade incident in Rulesmd Editor is the reference red-line case for these rules.

## Compatibility

The source-level `src/styles/legacy-classic/index.ts` remains as a compatibility entry for repository development, but package consumers are routed through the standard `dist` export map.

Existing component names and public props are intentionally preserved during this migration.
