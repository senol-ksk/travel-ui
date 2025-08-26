import { Container, Title } from '@mantine/core'
import { getContent } from '@/libs/cms-data'
import { CmsContent } from '@/types/cms-types'
import { notFound } from 'next/navigation'
import { HelpPage } from './_components/help-form-page'

type CMSContactParams = {
  title: {
    value: string
  }
  address: {
    value: string
  }
  address_value: {
    value: string
  }
  call: {
    value: string
  }
  call_value: {
    value: string
  }
  fax: {
    value: string
  }
  fax_value: {
    value: string
  }
  email: {
    value: string
  }
  email_value: {
    value: string
  }
  map: {
    value: string
  }
  btn_text: {
    value: string
  }
  notify: {
    value: string
  }
}

export default async function ContactPage() {
  const data = (
    await getContent<CmsContent<null, CMSContactParams>>('iletisim')
  )?.data

  if (!data) return notFound()

  const { params } = data

  return (
    <Container className='mt-5 space-y-6 rounded-md border p-4 shadow'>
      <HelpPage />
      <div>
        <div className='mb-5 px-7'>
          <Title order={2} className='mb-4'>
            İletişim Bilgileri
          </Title>

          <div className='space-y-3'>
            <div className='flex items-start gap-3'>
              <div className='flex items-center gap-2'>
                <strong className='text-gray-800'>
                  {params.address.value}:
                </strong>
                <div className='text-gray-600'>
                  {params.address_value.value}
                </div>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='flex items-center gap-2'>
                <strong className='text-gray-800'>{params.call.value}:</strong>
                <a
                  href={`tel:${params.call_value.value.trim()}`}
                  className='text-blue-600 hover:underline'
                >
                  {params.call_value.value}
                </a>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='flex items-center gap-2'>
                <strong className='text-gray-800'>{params.fax.value}:</strong>
                <div className='text-gray-600'>{params.fax_value.value}</div>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='flex items-center gap-2'>
                <strong className='text-gray-800'>{params.email.value}:</strong>
                <a
                  href={`mailto:${params.email_value.value}`}
                  className='text-blue-600 hover:underline'
                >
                  {params.email_value.value}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='space-y-4'>
            <div className='overflow-hidden rounded-md border'>
              <div dangerouslySetInnerHTML={{ __html: params.map.value }} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
