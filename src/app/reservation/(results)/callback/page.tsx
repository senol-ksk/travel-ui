import { request, serviceRequest } from '@/network'

type IProps = {
  searchParams: Promise<{
    moduleName: string
    orderId: string
    searchToken: string
    sessionToken: string
  }>
}

const CallbackPage: React.FC<IProps> = async ({ searchParams }) => {
  const { searchToken, sessionToken } = await searchParams
  const getSummary = await serviceRequest({
    axiosOptions: {
      url: `/api/product/summary`,
      withCredentials: true,
      params: {
        searchToken,
        sessionToken,
      },
    },
  })

  return (
    <div>
      {getSummary?.data || getSummary?.success ? (
        <textarea
          className='h-[500px] w-full'
          defaultValue={JSON.stringify(getSummary, null, 2)}
        />
      ) : (
        'No data received or an error occurred'
      )}
    </div>
  )
}

export default CallbackPage
