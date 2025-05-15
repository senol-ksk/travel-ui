import { Image } from '@mantine/core'

type IProps = {
  airlineCode: string
  width?: number
  height?: number
  alt?: string
}

const AirlineLogo: React.FC<IProps> = ({
  airlineCode,
  width = 32,
  height = 32,
  alt = airlineCode,
}) => {
  return (
    <Image
      src={`https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/${airlineCode.toLocaleLowerCase()}_sq.svg`}
      alt={alt}
      style={{
        width,
        height,
      }}
    />
  )
}

export { AirlineLogo }
