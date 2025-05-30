'use client'

import { DEFAULT_THEME, mergeMantineTheme, Modal, rem } from '@mantine/core'

import { fonts } from './fonts'
import { colors } from './colors'
import { DatePicker } from '@mantine/dates'

const mantineTheme = mergeMantineTheme(
  DEFAULT_THEME,

  {
    ...fonts,
    ...colors,
    components: {
      Container: {
        defaultProps: {
          size: rem(1200),
        },
      },
      Modal: Modal.extend({
        styles: {
          title: {
            fontWeight: 600,
          },
        },
      }),
      DatePicker: DatePicker.extend({
        defaultProps: {
          withCellSpacing: false,
        },
      }),
      Switch: {
        defaultProps: {
          withThumbIndicator: false,
        },
      },
    },
  }
)

export { mantineTheme }
