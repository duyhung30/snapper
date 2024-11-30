/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // SFProDisplay: ['SF-Pro-Display-Regular', 'sans-serif'],
        // SFProDisplayBold: ['SF-Pro-Display-Bold', 'sans-serif'],
        // SFProDisplayHeavy: ['SF-Pro-Display-Heavy', 'sans-serif'],
        // SFProDisplayUltralight: ['SF-Pro-Display-Ultralight', 'sans-serif'],
        // SFProDisplayLight: ['SF-Pro-Display-Light', 'sans-serif'],
        // SFProDisplayMedium: ['SF-Pro-Display-Medium', 'sans-serif'],
        // SFProDisplaySemibold: ['SF-Pro-Display-Semibold', 'sans-serif'],
        Jakarta: ["Jakarta", "sans-serif"],
        JakartaBold: ["Jakarta-Bold", "sans-serif"],
        JakartaExtraBold: ["Jakarta-ExtraBold", "sans-serif"],
        JakartaExtraLight: ["Jakarta-ExtraLight", "sans-serif"],
        JakartaLight: ["Jakarta-Light", "sans-serif"],
        JakartaMedium: ["Jakarta-Medium", "sans-serif"],
        JakartaSemiBold: ["Jakarta-SemiBold", "sans-serif"],
        // Recursive: ["Recursive", "sans-serif"],
        // RecursiveBold: ["Recursive-Bold", "sans-serif"],
        // RecursiveExtraBold: ["Recursive-ExtraBold", "sans-serif"],
        // RecursiveLight: ["Recursive-Light", "sans-serif"],
        // RecursiveMedium: ["Recursive-Medium", "sans-serif"],
        // RecursiveSemiBold: ["Recursive-SemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
}

