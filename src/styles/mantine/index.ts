'use client'

import {
  DEFAULT_THEME,
  Drawer,
  mergeMantineTheme,
  Modal,
  Portal,
  rem,
} from '@mantine/core'

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
      Modal: Modal.extend({
        styles: {
          title: {
            fontWeight: 600,
          },
        },
      }),
      Drawer: Drawer.extend({
        styles: {
          title: {
            fontWeight: 600,
          },
        },
      }),
    },
  }
)

export { mantineTheme }
