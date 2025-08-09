// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './index.html',            // for your public HTML
    './src/**/*.{js,jsx,ts,tsx}', // for all React code
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
