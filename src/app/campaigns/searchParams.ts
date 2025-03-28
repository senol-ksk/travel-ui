import { createLoader, parseAsString } from 'nuqs/server'

export const campaignParser = {
  categoryId: parseAsString,
}

export const loadCampaignSearchParams = createLoader(campaignParser)
