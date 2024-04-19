### Describe the bug

Not sure if this really is a bug, or a feature request, but I kindof expected it to work.

So, I have a project where I have two entrypoints, one is for the base functionality, one is for react specific functionality.

```JSON
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "./react": {
      "import": {
        "types": "./dist/react.d.ts",
        "default": "./dist/react.js"
      }
    }
  },
```
`vite-plugin-dts` handles two entrypoints quite well, and creates seperate `d.ts` files for both `index.js` and `react.js`. 

The problem is they use common functionality, Vite detects this and extract this functionality into a seperate file, so both entrypoints can import from it. `vite-plugin-dts` takes a different approach to solve this problem; it inserts the typings in both .d.ts files instead of creating this "CommonCode" file. This leads to two definitions of several of the types, and leads to some interesting type mismatch bugs. 

I only discovered this bug because I had a class in the common code, which defines `private readonly some_value`. 

![image](https://github.com/qmhc/vite-plugin-dts/assets/24886567/608bbfe5-5435-41aa-90bc-ceee67e0aa9f)


### Reproduction

https://github.com/Kegulf/vitejs-vite-jbxngt

### Steps to reproduce

- Create package being bundled in lib mode by vite with two entrypoints ( See vite.config.ts below )
- Add Entrypoint definitions to package.json (see section "In package.json" below)
- Create three files in source, two is entrypoints, one is common code used by both entrypoints.
  - Make sure to export the code using the common code from both entrypoints.


### In package.json
```JSON
  "type": "module",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "./react": {
      "import": {
        "types": "./dist/react.d.ts",
        "default": "./dist/react.js"
      }
    }
  },

```
---------
### vite.config.ts
```TS
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import packageJson from "./package.json";
import tsconfigJson from "./tsconfig.json";

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  build: {
    sourcemap: true,
    target: tsconfigJson.compilerOptions.target,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        react: resolve(__dirname, "src/react/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        ...Object.keys(packageJson.peerDependencies),
        "react/jsx-runtime",
      ],
    },
  },
});

```

### System Info

```shell
System:
    OS: Windows 11 10.0.22621
    CPU: (20) x64 12th Gen Intel(R) Core(TM) i7-12700H
    Memory: 9.38 GB / 31.68 GB
  Binaries:
    Node: 20.9.0 - C:\Program Files\nodejs\node.EXE
    npm: 10.2.3 - C:\Program Files\nodejs\npm.CMD
  Browsers:
    Edge: Chromium (123.0.2420.97)
    Internet Explorer: 11.0.22621.1
  npmPackages:
    @vitejs/plugin-react: ^4.2.1 => 4.2.1
    vite: ^5.2.9 => 5.2.9
    vite-plugin-dts: ^3.8.3 => 3.8.3
```
```


### Validations

- [X] Read the [FAQ](https://github.com/qmhc/vite-plugin-dts#faq).
- [X] Check that there isn't [already an issue](https://github.com/qmhc/vite-plugin-dts/issues) that reports the same bug to avoid creating a duplicate.
- [X] The provided reproduction is a [minimal reproducible example](https://stackoverflow.com/help/minimal-reproducible-example) of the bug.