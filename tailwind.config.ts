import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: {
          light: "#FFFFFF",
          dark: "#09090B",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#121214",
        },
        elevated: {
          light: "#F4F4F5",
          dark: "#18181B",
        },
        brand: {
          primary: "#000000",
          "primary-light": "#27272A",
          "primary-dark": "#000000",
          mint: "#71717A",
          accent: "#000000",
          "accent-hover": "#27272A",
          "accent-soft": "#F4F4F5",
          "accent-dark": "#27272A",
        },
        ink: {
          primary: "#09090B",
          secondary: "#52525B",
          muted: "#71717A",
          light: "#FAFAFA",
        },
        line: {
          subtle: "#E4E4E7",
          dark: "#27272A",
        },
        state: {
          success: "#18181B",
          warning: "#52525B",
          danger: "#18181B",
          info: "#27272A",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        bubble: "18px",
      },
    },
  },
  plugins: [],
};

export default config;
