import {
  Group,
  Modal,
  Radio,
  Title,
  UnstyledButton,
  Text,
  LoadingOverlay,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { MdHealthAndSafety } from 'react-icons/md'

import { CheckoutCard } from '@/components/card'
import { InsuranceInfoApiResponse } from '@/types/passengerViewModel'

type IProps = {
  insurance: InsuranceInfoApiResponse
  onChange: (state: boolean) => void
  isPending: boolean
  isInsuranceSelected: boolean
}

const TravelInsurancePackages: React.FC<IProps> = ({
  insurance,
  onChange = () => {},
  isPending,
  isInsuranceSelected = false,
}) => {
  const [opened, { open, close }] = useDisclosure(false)

  const insuranceInfo = insurance.insurance.at(0)

  return (
    <>
      <CheckoutCard>
        <div className='flex items-center gap-3'>
          <div>
            <MdHealthAndSafety size={22} className='text-blue-800' />
          </div>
          <Title order={3} fz={'xl'}>
            Seyahat Sağlık Güvencesi
          </Title>
        </div>

        <div>
          Seyahat Destek Hizmet Paketi ile Seyahatinizi Güvenceye Almak İster
          misiniz?
        </div>

        <Radio.Group
          name='callCenterSupport_radio'
          onChange={async (value) => {
            onChange(value === '1')
          }}
          pos={'relative'}
          value={isInsuranceSelected ? '1' : '2'}
        >
          <LoadingOverlay
            visible={isPending}
            loaderProps={{
              type: 'dots',
            }}
          />
          <div className='grid gap-3 md:flex md:gap-5'>
            <Radio.Card value='2' className='p-4 md:col-8' disabled={isPending}>
              <Group wrap='nowrap'>
                <Radio.Indicator />
                <div>Hayır, İstemiyorum</div>
              </Group>
            </Radio.Card>
            <Radio.Card value='1' className='p-4' disabled={isPending}>
              <Group wrap='nowrap'>
                <Radio.Indicator />
                <div>Evet, İstiyorum</div>
              </Group>
            </Radio.Card>
          </div>
        </Radio.Group>

        <div className='grid pt-4 md:flex'>
          <Text
            size='xs'
            className='grid items-center text-gray-700 md:flex md:gap-2'
          >
            * {insuranceInfo?.providerName}
            <UnstyledButton
              onClick={open}
              type='button'
              size='xs'
              className='text-sm text-blue-500'
            >
              Detaylı bilgi
            </UnstyledButton>
          </Text>
        </div>
      </CheckoutCard>
      <Modal
        opened={opened}
        onClose={close}
        title={insuranceInfo?.insuranceCategoryTitle}
      >
        <div className='text-sm'>
          <p>{insuranceInfo?.insuranceDescripton}</p>
          <ul className='grid list-disc gap-2 ps-4 pt-2'>
            {insuranceInfo?.insuranceGuarantee &&
              Object.entries(JSON.parse(insuranceInfo?.insuranceGuarantee)).map(
                (item) => {
                  return (
                    <li key={item[0]}>
                      {item[0]} {typeof item[1] === 'string' ? item[1] : ''}
                    </li>
                  )
                }
              )}
          </ul>
        </div>
      </Modal>
    </>
  )
}

export { TravelInsurancePackages }
