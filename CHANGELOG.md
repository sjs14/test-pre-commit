# [3.3.0-alpha.5](https://github.com/vuejs/core/compare/v3.3.0-alpha.4...v3.3.0-alpha.5) (2023-03-26)

### Bug Fixes

* **runtime-core:** support `getCurrentInstance` across mutiple builds of Vue ([8d2d5bf](https://github.com/vuejs/core/commit/8d2d5bf48a24dab44e5b03cb8fa0c5faa4b696e3))
* **types:** ensure defineProps with generics return correct types ([c288c7b](https://github.com/vuejs/core/commit/c288c7b0bd6077d690f42153c3fc49a45454a66a))


### Features

* **dx:** improve readability of displayed types for props ([4c9bfd2](https://github.com/vuejs/core/commit/4c9bfd2b999ce472f7481aae4f9dc5bb9f76628e))
* **types/jsx:** support jsxImportSource, avoid global JSX conflict ([#7958](https://github.com/vuejs/core/issues/7958)) ([d0b7ef3](https://github.com/vuejs/core/commit/d0b7ef3b61d5f83e35e5854b3c2c874e23463102))

### BREAKING CHANGES

* Vue no longer registers the global `JSX` namespace by default. This is necessary to avoid global namespace collision with React so that TSX of both libs can co-exist in the same project. This should not affect SFC-only users with latest version of Volar.

  For TSX users, the old global behavior can be enabled by explicitly importing or referencing `vue/jsx`. Alternatively, the user can set [jsxImportSource](https://www.typescriptlang.org/tsconfig#jsxImportSource) to `'vue'` in `tsconfig.json`, or opt-in per file with `/* @jsxImportSource vue */`.

  Note this is a type-only breaking change in a minor release, which adheres to our [release policy](https://vuejs.org/about/releases.html#semantic-versioning-edge-cases).

```typescript
const a:string = '1'
```
```typescript
const a:string = '1'
```
```typescript
const a:string = '1'
```