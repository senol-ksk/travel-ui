'use client'

import {
  DEFAULT_THEME,
  mergeMantineTheme,
  Modal,
  rem,
  TextInput,
  Input,
  InputLabel,
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
          labelProps: {
            fw: 400,
          },
        },
      }),

      InputLabel: Input.Label.extend({
        defaultProps: {
          size: 'md',
          fw: 400,
        },
      }),
    },
  }
)

export { mantineTheme }
