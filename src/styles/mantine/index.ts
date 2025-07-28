'use client'

import {
  DEFAULT_THEME,
  mergeMantineTheme,
  Modal,
  rem,
  TextInput,
} from '@mantine/core'

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
      TextInput: TextInput.extend({
        defaultProps: {
          size: 'md',
        },
        styles: {
          input: {
            fontSize: '14px',
          },
          label: {
            fontSize: '14px',
            fontWeight: 400,
          },
        },
      }),
    },
  }
)

export { mantineTheme }
