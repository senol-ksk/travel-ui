import { DEFAULT_THEME, mergeMantineTheme, rem } from '@mantine/core'

import { fonts } from './fonts'

const mantineTheme = mergeMantineTheme(
  DEFAULT_THEME,

  {
    ...fonts,
    components: {
      Container: {
        defaultProps: {
          size: rem(1200),
        },
      },
    },
  }
)

export { mantineTheme }
