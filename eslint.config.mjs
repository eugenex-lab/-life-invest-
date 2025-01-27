import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply rules only to TypeScript files
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable the rule
      "no-console": "off", // Disable console warnings
    },
  },
];

export default eslintConfig;
