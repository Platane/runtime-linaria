# Runtime Linaria

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

**Unstable** version of linaria that does not requires babel at build time.

The goal is to skip using babel for in dev mode to get faster build iteration, while remaining ISO with the zero runtime in production.

⚠️ This project is a work in progress and might not yield the same css as the official linaria plugin

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

# Discrepancies

- fix the hacky "global" keyword handling
- use the same className naming convention as linaria
