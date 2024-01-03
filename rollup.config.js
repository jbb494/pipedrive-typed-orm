import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

import packageJson from "./package.json" assert { type: "json" };

export default [
  {
    // Bundle for CommonJS and ES Modules
    input: ["src/index.ts"], // Your main TypeScript file and all TypeScript files in the scripts folder
    output: [
      {
        file: packageJson.main, // CommonJS output, typically 'dist/library.js'
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module, // ES Module output, typically 'dist/library.mjs'
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }), // TypeScript plugin
    ],
    external: Object.keys(packageJson.dependencies || {}),
  },
  {
    // Bundle for CommonJS and ES Modules
    input: ["src/scripts/push-schema.ts"], // Your main TypeScript file and all TypeScript files in the scripts folder
    output: [
      {
        file: `./dist/scripts/index.js`, // CommonJS output, typically 'dist/library.js'
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }), // TypeScript plugin
    ],
    external: Object.keys(packageJson.dependencies || {}),
  },
  {
    // Bundle for TypeScript definitions (.d.ts)
    input: "src/index.ts", // Your main TypeScript file
    output: [{ file: "dist/index.d.ts", format: "es" }], // Output for .d.ts files
    plugins: [dts()],
    external: Object.keys(packageJson.dependencies || {}),
  },
];
