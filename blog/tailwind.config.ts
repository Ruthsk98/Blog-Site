import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0a0a0a', soft: '#121212', line: '#262626' },
        crimson: { DEFAULT: '#dc2626', bright: '#ef4444' },
        cream: { DEFAULT: '#faf8f6', deep: '#f3efe6' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
