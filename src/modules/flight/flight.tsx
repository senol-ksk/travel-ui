import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { useForm } from '@mantine/form'

import { Button } from '@mantine/core'

import { Input } from '@/components/search-engine/input'
import { Locations } from '@/components/search-engine/locations'

const locationSchema = z.object({
  code: z.string(),
  iata: z.array(z.string()),
  type: z.number(),
  isDomestic: z.boolean(),
  id: z.number(),
})

const schema = z.object({
  // DepartureTime: z.string().date(), //"2024-09-11",
  // CabinClass: z.number(),
  // MaxConnections: z.number(),
  Origin: locationSchema,
  Destination: locationSchema,
})

export const Flight = () => {
  const form = useForm<typeof schema.shape>({
    mode: 'uncontrolled',
    validate: zodResolver(schema),
  })

  return (
    <form onSubmit={form.onSubmit((event) => console.log(event))}>
      <div className='grid gap-2 md:grid-cols-12 md:gap-4'>
        <div className='col-span-6 md:col-span-3'>
          <Locations
            title='Kalkış'
            key={form.key('Origin')}
            inputProps={{ ...form.getInputProps('Origin') }}
          />
        </div>
        <div className='col-span-6 md:col-span-3'>
          <Locations
            title='Nereye'
            key={form.key('Destination')}
            inputProps={{ ...form.getInputProps('Destination') }}
          />
        </div>
        <div className='col-span-6 md:col-span-3 lg:col-span-2'>
          <Input label='Tarihler' icon={'calendar'} />
        </div>
        <div className='col-span-6 md:col-span-3 lg:col-span-2'>
          <Input label={'Yolcular'} icon={'passenger'} />
        </div>
        <div className='sm:col-grid-2 col-span-12 flex grow-0 lg:col-span-2'>
          <Button
            className='mx-auto w-full sm:w-auto lg:h-full lg:w-full'
            type='submit'
          >
            Ara
          </Button>
        </div>
      </div>
    </form>
  )
}
