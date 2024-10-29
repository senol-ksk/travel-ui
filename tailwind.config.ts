import tailwindPresetMantine from 'tailwind-preset-mantine'
import type { Config } from 'tailwindcss'

const config: Config = {
  corePlugins: {
    preflight: false,
  },
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
  // presets: [tailwindPresetMantine()],
  plugins: [],
}
export default config
