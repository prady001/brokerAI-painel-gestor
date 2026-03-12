import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': 'var(--bg-deep)',
        'bg-base': 'var(--bg-base)',
        'bg-surface': 'var(--bg-surface)',
        'bg-card': 'var(--bg-card)',
        blue: {
          DEFAULT: 'var(--blue)',
          light: 'var(--blue-light)',
        },
        cyan: 'var(--cyan)',
        green: 'var(--green)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        lg: '16px',
        xl: '24px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        'btn-primary': '0 0 20px rgba(59, 130, 246, 0.25), 0 0 60px rgba(59, 130, 246, 0.1)',
        'btn-primary-hover': '0 0 30px rgba(59, 130, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.15)',
        'card-glow': '0 0 40px rgba(59, 130, 246, 0.04)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '100% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
