module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// For revirewers
// Solves next migration error: NX   It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
// Will remove comment when reviewed
