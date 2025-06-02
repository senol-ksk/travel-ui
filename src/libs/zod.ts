import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
// Import your language translation files
import translation from 'zod-i18n-map/locales/tr/zod.json'

// lng and resources key depend on your locale.
i18next.init({
  lng: 'tr',
  resources: {
    tr: { zod: translation },
  },
})
z.setErrorMap(zodI18nMap)

// export configured zod instance
export { z }
