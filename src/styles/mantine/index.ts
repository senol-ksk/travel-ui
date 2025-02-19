'use client'

import { DEFAULT_THEME, mergeMantineTheme, Portal, rem } from '@mantine/core'

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
      Portal: Portal.extend({
        defaultProps: {
          reuseTargetNode: true,
        },
      }),
    },
  }
)

export { mantineTheme }
