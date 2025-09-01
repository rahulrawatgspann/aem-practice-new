/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './blocks/**/*.{html,js,css}',
    './scripts/**/*.{js,css}',
    './styles/**/*.css',
    './*.html',
  ],
  // Prevent Tailwind from overriding AEM EDS base styles
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      // Extend existing CSS variables from AEM EDS
      colors: {
        'aem-background': 'var(--background-color)',
        'aem-text': 'var(--text-color)',
        'aem-link': 'var(--link-color)',
        'aem-light': 'var(--light-color)',
        'aem-dark': 'var(--dark-color)',
      },
      fontFamily: {
        'aem-body': 'var(--body-font-family)',
        'aem-heading': 'var(--heading-font-family)',
      },
      fontSize: {
        'aem-body-m': 'var(--body-font-size-m)',
        'aem-body-s': 'var(--body-font-size-s)',
        'aem-heading-xl': 'var(--heading-font-size-xl)',
        'aem-heading-l': 'var(--heading-font-size-l)',
      },
    },
  },
  plugins: [],
};
