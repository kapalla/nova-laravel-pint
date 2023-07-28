import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/main.js",
    output: {
      file: "laravel-pint.novaextension/Scripts/main.js",
      format: "cjs",
    },
    plugins: [commonjs()],
  },
];
