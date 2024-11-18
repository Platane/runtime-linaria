# Runtime Linaria

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

**Unstable** version of linaria vite plugin that does not requires babel at build time.

The goal is to skip using babel for in dev mode to get faster build iteration, while remaining ISO with the zero runtime in production.

⚠️ This project is a work in progress and might not yield the same css as the official linaria plugin

🧑‍🔬 demo page:

- [with linaria-runtime plugin](https://platane.github.io/vite-plugin-runtime-linaria/linaria-runtime/index.html)

- [with official linaria plugin](https://platane.github.io/vite-plugin-runtime-linaria/linaria/index.html)

# Usage

```ts
// vite.config.ts
import linaria from "@wyw-in-js/vite";

export default defineConfig(({ mode, command }) => ({
  plugins: [
    command === "build"
      ? //
        // use the classic linaria vite plugin in build for zero runtime build
        linaria({ include: ["**/*.tsx"] })
      : //
        // use the runtime linaria in dev, for faster rebuild
        runtimeLinaria({ include: ["**/*.tsx"] }),
  ],
}));
```

[example](demo/vite.config.ts)

**package manager**

This module is not (yet) published on npm, we can add it as:

```js
// package.json
    "dependencies": {
        "vite-plugin-runtime-linaria": "github:platane/vite-plugin-runtime-linaria"
```

# Discrepancies

- fix the hacky "global" keyword handling
- use the same className naming convention as linaria
