import { rem } from '@mantine/core'
import type { Config } from 'tailwindcss'

console.log('--------s----ssss')
console.log(rem(1200))
console.log('---------------------')
var containerRawWidth = rem(1200)

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        screens: {
          raw: '75rem',
        },
      },
    },
  },
}
export default config
