import { DEFAULT_THEME, mergeMantineTheme } from '@mantine/core'

import { fonts } from './fonts'

const mantineTheme = mergeMantineTheme(DEFAULT_THEME, {
  ...fonts,
})

export { mantineTheme }
