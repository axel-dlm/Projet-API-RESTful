const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'fr'],
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'fr',
  cookie: 'lang',
  queryParameter: 'lang',
  autoReload: true,
  syncFiles: true
});

console.log('i18n configured with directory:', path.join(__dirname, '..', 'locales'));

module.exports = i18n.init;