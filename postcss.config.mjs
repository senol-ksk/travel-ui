// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-preset-mantine': {
      autoRem: true,
      lightDarkFunction: false,
    },
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
        'mantine-breakpoint-2xl': '96em',
      },
    },
  },
}

export default config
