import { Column, Img, Row } from '@react-email/components'
type IProps = {
  name: React.ReactNode
}

export const SuccessCard: React.FC<IProps> = ({ name }: IProps) => {
  return (
    <div className='mb-3 grid rounded-lg border border-solid border-green-800 p-3 text-center font-bold'>
      <Row className='pb-5'>
        <Column align='center'>
          <Img
            src={`https://ykmturizm.mncdn.com/11/Files/email/img/check-icon.png`}
            className='mx-auto'
          />
        </Column>
      </Row>
      <div>
        Sayın {name},
        <br /> İşleminiz başarı ile gerçekleşmiştir. Bir sonraki seyahatinizde
        görüşmek üzere
      </div>
    </div>
  )
}
