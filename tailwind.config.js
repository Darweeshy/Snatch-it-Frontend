/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        primary: {
          navy: 'var(--color-primary-navy)',
          teal: 'var(--color-primary-teal)',
          gold: 'var(--color-primary-gold)',
          DEFAULT: 'var(--color-primary-navy)',
          // Legacy support
          '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd',
          '400': '#60a5fa', '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8',
          '800': '#1e40af', '900': '#1e3a8a', '950': '#172554',
        },
        secondary: {
          sand: 'var(--color-secondary-sand)',
          terracotta: 'var(--color-secondary-terracotta)',
          olive: 'var(--color-secondary-olive)',
          DEFAULT: 'var(--color-secondary-terracotta)',
          // Legacy support
          '50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0', '300': '#cbd5e1',
          '400': '#94a3b8', '500': '#64748b', '600': '#475569', '700': '#334155',
          '800': '#1e293b', '900': '#0f172a', '950': '#020617',
        },
        neutral: {
          white: 'var(--color-neutral-white)',
          light: 'var(--color-neutral-light)',
          gray: 'var(--color-neutral-gray)',
          dark: 'var(--color-neutral-dark)',
        },
        accent: {
          turquoise: 'var(--color-accent-turquoise)',
          coral: 'var(--color-accent-coral)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      }
    },
  },
  plugins: [
    forms,
  ],
}