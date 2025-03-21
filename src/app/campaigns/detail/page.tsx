import { type SearchParams } from 'nuqs/server'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const CampaignsDefault: React.FC<PageProps> = async ({ searchParams }) => {
  const params = await searchParams
  console.log(params)

  return <div>kampanya detay</div>
}

export default CampaignsDefault
