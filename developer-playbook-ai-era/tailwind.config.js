export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'playbook-red': '#EF3B36',
        'playbook-dark': '#1a1a1a',
      },
      fontFamily: {
        serif: ['Georgia', 'Garamond', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', '1rem'],
        sm: ['0.875rem', '1.25rem'],
        base: ['1rem', '1.5rem'],
        lg: ['1.125rem', '1.75rem'],
        xl: ['1.25rem', '1.75rem'],
        '2xl': ['1.5rem', '2rem'],
        '3xl': ['1.875rem', '2.25rem'],
        '4xl': ['2.25rem', '2.5rem'],
        '5xl': ['3rem', '1'],
        '6xl': ['3.75rem', '1'],
        '7xl': ['4.5rem', '1'],
        '8xl': ['6rem', '1'],
      },
      spacing: {
        safe: 'max(1rem, env(safe-area-inset-bottom))',
      },
      opacity: {
        5: '0.05',
        10: '0.1',
        15: '0.15',
        85: '0.85',
        90: '0.9',
      },
    },
  },
  plugins: [],
};
