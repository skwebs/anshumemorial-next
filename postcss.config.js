// postcss.config.js
// Tailwind CSS 4 uses its own PostCSS plugin (@tailwindcss/postcss)
// autoprefixer is no longer needed — Tailwind 4 handles vendor prefixes natively
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
