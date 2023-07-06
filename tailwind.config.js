/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
        'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: 
      {
        'custom-gradient': 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 57%, rgba(168,157,135,1) 100%)',
      },      
      colors:
      {
        primary: '#C2DEDC',
        secondary: '#ECE5C7',
        third: '#CDC2AE',
        fourth: '#116A7B'
      }
    },
  },
  plugins: [],
}
