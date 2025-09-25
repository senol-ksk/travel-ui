'use client'

import {
  Button,
  TextInput,
  Textarea,
  Group,
  Text,
  Stack,
  Box,
  ActionIcon,
  Modal,
  Select,
  NativeSelect,
} from '@mantine/core'
import { FaExclamationCircle } from 'react-icons/fa'
import { useDisclosure } from '@mantine/hooks'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceRequest } from '@/network'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

const schema = z.object({
  name: z.string().nonempty().min(3),
  lastName: z.string().nonempty().min(3),
  email: z.string().email(),
  gsm: z.string().nonempty(),
  subject: z.string().nonempty(),
})
type SchemaType = z.infer<typeof schema>

function NoRoomsForm() {
  const formAction = useForm({
    resolver: zodResolver(schema),
  })

  function handleSubmit(data: SchemaType) {
    submitMutation.mutate(data)
  }
  const submitMutation = useMutation({
    mutationFn: async (data: SchemaType) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/callForm',
          method: 'Post',
          data,
        },
      })
      return response
    },
    onSuccess: (response) => {
      if (response?.success) {
        notifications.show({
          title: 'Başarılı',
          message:
            'Talebiniz başarıyla alınmıştır. Yetkililerimiz en kısa zamanda size ulaşacaktır.',
          color: 'green',
        })
        formAction.reset()
        closeModal()
      } else {
        notifications.show({
          title: 'Hata',
          message: 'Lütfen tekrar deneyiniz.',
          color: 'red',
        })
      }
    },
    onError: (error) => {
      console.error('Form submission error:', error)
      notifications.show({
        title: 'Hata',
        message: 'Bir hata oluştu. Lütfen tekrar deneyiniz.',
        color: 'red',
      })
    },
  })
  const [opened, { open: openModal, close: closeModal }] = useDisclosure(false)

  const dayOptions = [
    { value: 'pazartesi', label: 'Pazartesi' },
    { value: 'sali', label: 'Salı' },
    { value: 'carsamba', label: 'Çarşamba' },
    { value: 'persembe', label: 'Perşembe' },
    { value: 'cuma', label: 'Cuma' },
  ]
  const timeOptions = [
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' },
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' },
  ]

  return (
    <Box className='rounded-xl border border-blue-100 bg-blue-50 p-6 md:p-8'>
      <Stack gap='lg'>
        <Box className='text-center'>
          <ActionIcon
            size={56}
            radius='xl'
            variant='filled'
            color='red'
            className='mx-auto mb-4'
          >
            <FaExclamationCircle size={28} />
          </ActionIcon>
          <Text size='xl' fw={700} c='red' className='mb-4'>
            Aradığınız kriterlere uygun sonuç bulunamamıştır
          </Text>
        </Box>
        <Button
          size='lg'
          className='rounded bg-blue-800 font-semibold text-white hover:bg-blue-700'
          onClick={openModal}
        >
          TELEFONLA SATIŞ / TALEP ET
        </Button>

        <Modal
          withCloseButton
          opened={opened}
          onClose={closeModal}
          size={'xl'}
          title={'TELEFONLA SATIŞ / TALEP ET'}
        >
          <Text size='md' c='dark' className='text-center leading-relaxed'>
            Otel sonuçları hakkında ayrıntılı bilgi ve rezervasyon için{' '}
            <Text
              component='a'
              href='tel:+908508780400'
              fw={700}
              c='blue'
              className='cursor-pointer text-lg hover:underline'
            >
              0850 878 0 400
            </Text>{' '}
            nolu Müşteri Hizmetlerini arayabilir,{' '}
            <Text
              component='a'
              href='mailto:operasyon@ykmturizm.com.tr'
              fw={700}
              c='blue'
              className='cursor-pointer text-lg hover:underline'
            >
              operasyon@ykmturizm.com.tr
            </Text>{' '}
            adresine mail atabilir ya da aşağıdaki formu doldurabilirsiniz.
            Yetkililerimiz en kısa zamanda size ulaşacaktır.
          </Text>
          <form onSubmit={formAction.handleSubmit(handleSubmit)}>
            <Stack gap='md' className='mt-5'>
              <div className='flex flex-col gap-4 md:flex-row'>
                <TextInput
                  label='Adınız'
                  placeholder='Adınızı girin'
                  {...formAction.register('name')}
                  error={formAction.formState.errors.name?.message}
                  className='flex-1'
                />
                <TextInput
                  label='Soyadınız'
                  placeholder='Soyadınızı girin'
                  {...formAction.register('lastName')}
                  error={formAction.formState.errors.lastName?.message}
                  className='flex-1'
                />
              </div>
              <div className='flex flex-col gap-4 md:flex-row'>
                <TextInput
                  label='E-posta Adresiniz'
                  type='email'
                  placeholder='email@email.com'
                  {...formAction.register('email')}
                  error={formAction.formState.errors.email?.message}
                  className='flex-1'
                />
                <TextInput
                  inputMode='numeric'
                  type='tel'
                  label='Telefon Numaranız'
                  placeholder='+90_________'
                  {...formAction.register('gsm')}
                  error={formAction.formState.errors.gsm?.message}
                  className='flex-1'
                />
              </div>

              <Textarea
                label='Mesajınızı Giriniz'
                placeholder='Rezervasyon talebiniz hakkında detay verebilirsiniz...'
                {...formAction.register('subject')}
                error={formAction.formState.errors.subject?.message}
                minRows={13}
              />

              <Button
                type='submit'
                size='lg'
                loading={submitMutation.isPending}
                className='text-md w-full rounded bg-blue-800 font-semibold text-white hover:bg-blue-700'
              >
                TELEFONLA SATIŞ / TALEP ET
              </Button>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </Box>
  )
}
export { NoRoomsForm }
