# Runtime Linaria

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

**Unstable** version of linaria that does not requires babel at build time.

The goal is to skip using babel for in dev mode to get faster build iteration, while remaining ISO with the zero runtime in production.

# Discrepancies

- fix the hacky "global" keyword handling
- use the same className naming convention as linaria
