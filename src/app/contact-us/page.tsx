import { Container, Text, Title } from '@mantine/core'

import { getContent } from '@/libs/cms-data'
import { CmsContent } from '@/types/cms-types'

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

  if (!data) return null

  const { params } = data

  return (
    <Container className='flex flex-col gap-3 py-4 md:gap-5 md:py-6'>
      <Title>{params.title.value}</Title>
      <Text>
        Seyahat hizmetlerimizle ilgili taleplerinizi bu form aracılığıyla bize
        iletebilirsiniz.
      </Text>
      <div className='flex flex-col gap-2'>
        <Title order={2}>İletişim</Title>
        <div>
          <strong>{params.address.value}</strong>: {params.address_value.value}
        </div>
        <div>
          <strong>{params.call.value}</strong>:{' '}
          <a href={`tel:${params.call_value.value.trim()}`}>
            {params.call_value.value}
          </a>
        </div>
        <div>
          <strong>{params.fax.value}</strong>: {params.fax_value.value}
        </div>
        <div>
          <strong>{params.email.value}</strong>:{' '}
          <a href={`mailto:${params.email_value.value}`}>
            {params.email_value.value}
          </a>
        </div>
      </div>
      <div>
        <div dangerouslySetInnerHTML={{ __html: params.map.value }} />
      </div>
    </Container>
  )
}
