'use client'

import { serviceRequest } from '@/network'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Button, NativeSelect, Textarea, TextInput, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import z from 'zod'

export const HelpPage = () => {
  const schema = z.object({
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    email: z.string().email(),
    phone: z.string().nonempty(),
    rezervasyon: z.string().optional(),
    seyehat: z.string().optional(),
    kategori: z.string().nonempty(),
    mesaj: z.string().nonempty(),
  })
  type SchemaType = z.infer<typeof schema>

  const formAction = useForm({
    resolver: zodResolver(schema),
  })
  function handleSubmit(data: SchemaType) {
    const submitData = {
      ...data,
    }
    submitMutiation.mutate(submitData)
  }
  const submitMutiation = useMutation({
    mutationFn: async (data: SchemaType) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/contact-us',
          method: 'Post',
          data,
        },
      })
      return response
    },
    onSuccess: (response) => {
      if (response?.success) {
        formAction.reset()
        alert('Mesajınız başarıyla gönderildi!')
      }
    },
    onError: (error) => {
      console.log(error)
      alert('Lütfen tekrar deneyin.')
    },
  })
  return (
    <form
      onSubmit={formAction.handleSubmit(handleSubmit)}
      className='mt-8 border-b pt-6 pb-2'
    >
      <div className='px-7'>
        <Title order={2} className='mb-4 text-gray-800'>
          Bize Ulaşın
        </Title>
        <p className='mb-6 text-gray-600'>
          İletişim Formu aracılığıyla öneri ve şikayetlerini bize iletebilir,
          ayrıca İletişim Bilgilerimize kolayca ulaşabilirsin.
        </p>

        <div className='space-y-6'>
          <Title order={3} className='text-gray-800'>
            İletişim Formu
          </Title>

          <div>
            <NativeSelect
              label='Kategori'
              {...formAction.register('kategori')}
              error={formAction.formState.errors.kategori?.message}
            >
              <option value=''>Kategori Seçin</option>
              <option value='genel'>Genel Bilgi</option>
              <option value='rezervasyon'>Rezervasyon</option>
              <option value='iptal'>İptal/Değişiklik</option>
              <option value='sikayet'>Şikayet</option>
              <option value='oneri'>Öneri</option>
              <option value='diger'>Diğer</option>
            </NativeSelect>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <TextInput
                type='text'
                placeholder='Ad'
                {...formAction.register('firstName')}
                error={formAction.formState.errors.firstName?.message}
              />
            </div>
            <div>
              <TextInput
                type='text'
                placeholder='Soyad'
                {...formAction.register('lastName')}
                error={formAction.formState.errors.lastName?.message}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <TextInput
                type='email'
                placeholder='E-Posta'
                {...formAction.register('email')}
                error={formAction.formState.errors.email?.message}
              />
            </div>
            <div>
              <TextInput
                type='tel'
                inputMode='numeric'
                placeholder='+90____'
                {...formAction.register('phone')}
                error={formAction.formState.errors.phone?.message}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <TextInput
                type='text'
                placeholder='Rezervasyon No (Opsiyonel)'
                {...formAction.register('rezervasyon')}
              />
            </div>
            <div>
              <TextInput
                type='text'
                placeholder='Seyahat Bilgisi (Opsiyonel)'
                {...formAction.register('seyehat')}
              />
            </div>
          </div>

          <div>
            <Textarea
              placeholder='Mesajınızı Yazın'
              rows={5}
              {...formAction.register('mesaj')}
              error={formAction.formState.errors.mesaj?.message}
            />
          </div>
          <div className='flex items-center justify-between py-4'>
            <p className='text-sm text-gray-600'>
              Kişisel verileriniz{' '}
              <a href='#' className='text-blue-600 hover:underline'>
                Aydınlatma Metni
              </a>{' '}
              kapsamında işlenmektedir.
            </p>

            <div className='text-end'>
              <Button
                size='md'
                radius={'md'}
                type='submit'
                loading={submitMutiation.isPending}
                className='w-45 rounded-md bg-blue-600 font-bold text-white transition-colors hover:bg-blue-700'
              >
                Gönder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
