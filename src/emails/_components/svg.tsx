import { Section } from '@react-email/components'
type IProps = {
  xmlns?: string
  width?: string
  height?: string
  viewBox?: string
  fill?: string
  children?: React.ReactNode
}

export const Svg: React.FC<IProps> = ({
  xmlns = 'http://www.w3.org/2000/svg',
  width = '24',
  height = '24',
  viewBox = '0 0 24 24',
  fill = 'none',

  children,
}: IProps) => {
  return (
    <svg
      xmlns={xmlns}
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
    >
      {children}
    </svg>
  )
}
