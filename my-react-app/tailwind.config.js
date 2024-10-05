// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        "1/15": "6.66667%", // 例えば15分の1の幅を追加
        "1/20": "5%", // 20分の1の幅を追加
      },
    },
  },
  variants: {},
  plugins: [],
};
