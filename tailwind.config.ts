import tailwindPresetMantine from 'tailwind-preset-mantine'

import type { Config } from 'tailwindcss'
import tailwindContainer from '@tailwindcss/container-queries'

const config: Config = {
  // corePlugins: {
  //   preflight: false,
  // },
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          lg: '1.5rem',
        },
      },
    },
  },
  presets: [tailwindPresetMantine()],
  plugins: [tailwindContainer],
}
export default config
