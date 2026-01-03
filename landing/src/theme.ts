import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f0ff" },
          100: { value: "#b3d1ff" },
          200: { value: "#80b3ff" },
          300: { value: "#4d94ff" },
          400: { value: "#2c5282" },
          500: { value: "#1a365d" },
          600: { value: "#153050" },
          700: { value: "#102843" },
          800: { value: "#0b1f36" },
          900: { value: "#061729" },
        },
        accent: {
          50: { value: "#e6fffa" },
          100: { value: "#b2f5ea" },
          200: { value: "#81e6d9" },
          300: { value: "#4fd1c5" },
          400: { value: "#38b2ac" },
          500: { value: "#0d9488" },
          600: { value: "#0b7a71" },
          700: { value: "#08615a" },
          800: { value: "#064744" },
          900: { value: "#042e2d" },
        },
      },
      fonts: {
        heading: { value: "'Inter', sans-serif" },
        body: { value: "'Inter', sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "white" },
          fg: { value: "{colors.brand.600}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.50}" },
          emphasized: { value: "{colors.brand.400}" },
          focusRing: { value: "{colors.brand.400}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
