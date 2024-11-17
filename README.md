# Runtime Linaria

**Unstable** version of linaria that does not requires babel at build time.

The goal is to skip using babel for in dev mode to get faster build iteration, while remaining ISO with the zero runtime in production.

# Discrepancies

- fix the hacky "global" keyword handling
- use the same className naming convention as linaria
