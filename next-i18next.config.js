module.exports = {
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'ja'],
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}