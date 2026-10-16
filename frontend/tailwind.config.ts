import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        vazir: ['var(--font-vazir)', 'Vazirmatn', 'system-ui', 'sans-serif'],
        sans: ['var(--font-vazir)', 'Vazirmatn', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F5EEDB',
          300: '#EDE0C3',
          400: '#DFCCA3',
          500: '#CEB27E',
          600: '#B8975B',
          700: '#947541',
          800: '#755B33',
          900: '#5A4526',
        },
        roseBakery: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
        amberWarm: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        bakeryBrown: {
          50: '#FBF8F5',
          100: '#F5EFE9',
          200: '#E7D9CB',
          300: '#D5BDA9',
          400: '#BA9C82',
          500: '#9B785D',
          600: '#7A5A42',
          700: '#5F4431',
          800: '#463123',
          900: '#2F1F15',
        },
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite',
        'float-fast': 'float 3.5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 15px rgba(244, 63, 94, 0.2), 0 0 30px rgba(245, 158, 11, 0.15)',
          },
          '100%': {
            boxShadow: '0 0 25px rgba(244, 63, 94, 0.4), 0 0 50px rgba(245, 158, 11, 0.3)',
          },
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(148, 117, 65, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        'glass-hover': '0 14px 40px 0 rgba(225, 29, 72, 0.15), 0 4px 12px 0 rgba(0, 0, 0, 0.06)',
        'glass-glow': '0 0 25px rgba(251, 113, 133, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
