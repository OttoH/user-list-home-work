module.exports = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
  semi: false,
  trailingComma: 'es5',
  singleQuote: true,
  overrides: [
    {
      files: ['*.json', '.*rc'],
      options: {
        tabWidth: 2,
        useTabs: false,
        printWidth: 60,
        parser: 'json5',
        quoteProps: 'preserve',
        singleQuote: false,
        trailingComma: 'none',
      },
    },
  ],
}
