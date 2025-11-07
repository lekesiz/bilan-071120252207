/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1ABC9C',
          dark: '#16A085',
          light: '#48D1B7',
        },
        secondary: {
          DEFAULT: '#2C3E50',
          light: '#34495E',
          dark: '#1A252F',
        },
        background: '#F4F7F6',
        surface: '#FFFFFF',
        text: {
          main: '#2C3E50',
          light: '#7F8C8D',
          disabled: '#BDC3C7',
        },
        accent: {
          DEFAULT: '#E74C3C',
          dark: '#C0392B',
        },
        warning: {
          DEFAULT: '#F39C12',
          dark: '#E67E22',
        },
        success: {
          DEFAULT: '#27AE60',
          dark: '#229954',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        sidebar: '16rem', // 256px
        'sidebar-collapsed': '4rem', // 64px
        header: '4rem', // 64px
        'content-max': '80rem', // 1280px
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        card: '0.75rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
