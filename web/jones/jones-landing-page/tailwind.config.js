module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: { body: 'Poppins' },
    extend: {
      colors: {
        // based on https://www.figma.com/file/aBAdX8bk4bmL0CyINq6MU0/DS-Tokens---LostArk---v1?node-id=101%3A13160
        primary: {
          200: '#D9784B', // light mid
          700: '#DE6B38', // main
        },
        gray: {
          200: '#C4C4C4', // light gray
          500: '#847C7C', // mid gray
          700: '#262829', // active input
          800: '#141617', // dark
        },
        alert: {
          300: '#7F688C', // pending
          700: '#3A2E40', // default
        },
        error: {
          300: '#FD6161', // light pnl
          500: '#F04438', // main
          700: '#B53027', // dark
        },
        warning: {
          500: '#F79009', // dark min
          600: '#DC6803', // dark
        },
        success: {
          300: '#52B590', // light pnl
          500: '#3F7B8E', // main
        },
        purple: {
          300: '#7A5AF8', // light
          500: '#7163BB', // main
        },
        card: {
          100: '#8A8C9733', // card hover
          300: '#36384033', // secondary card hover
          600: '#11141580', // paper dark
        },

        // TODO: remove after full reskin
        'jones-bg': '#00232f',
        'jones-orange': '#FF8320',
        'jones-green': '#2BE19E',
        'jones-slate': '#111415',
        'jones-gray': '#646262',
        'text-gradient-green': '#48C295',
        'gray-hover': '#49494966',
        'button-gray': '#1f2125',
      },
      keyframes: {
        fog: {
          '0%': { transform: 'translate3d(20%,-5%,0)' },
          '50%': { transform: 'translate3d(40%,5%,0)' },
          '100%': { transform: 'translate3d(20%,-5%,0)' },
        },
      },
      animation: {
        'fog-animation': 'fog 100s linear infinite',
      },
    },
  },
  plugins: [],
}
