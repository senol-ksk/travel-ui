import tailwindPresetMantine from 'tailwind-preset-mantine'

import type { Config } from 'tailwindcss'

const config: Config = {
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
}
export default config
