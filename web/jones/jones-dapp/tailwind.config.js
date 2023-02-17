module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./common/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
      "2xl": "1720px",
    },
    fontFamily: { body: "Poppins" },
    extend: {
      colors: {
        // based on https://www.figma.com/file/aBAdX8bk4bmL0CyINq6MU0/DS-Tokens---LostArk---v1?node-id=101%3A13160
        primary: {
          200: "#D9784B", // light mid
          700: "#DE6B38", // main
        },
        gray: {
          200: "#C4C4C4", // light gray
          500: "#847C7C", // mid gray
          700: "#262829", // main, active input
          800: "#141617", // dark
        },
        alert: {
          300: "#7F688C", // pending
          700: "#3A2E40", // default
        },
        error: {
          300: "#FD6161", // light pnl
          500: "#F04438", // main
          700: "#B53027", // dark
        },
        warning: {
          500: "#F79009", // dark min
          600: "#DC6803", // dark
        },
        success: {
          300: "#52B590", // light pnl
          500: "#3F7B8E", // main
        },
        purple: {
          300: "#7A5AF8", // light
          500: "#7163BB", // main
        },
        card: {
          100: "#8A8C9733", // card hover
          300: "#36384033", // secondary card hover
          600: "#11141580", // paper dark
        },
      },
    },
  },
  plugins: [],
};
