import { getContentsByCategorySlug } from '@/libs/cms-data'
import {
  AspectRatio,
  Card,
  CardSection,
  Image,
  rem,
  Title,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import NextImage from 'next/image'

type PageProps = {
  categoryId: string
}

const CategoryContents: React.FC<PageProps> = async ({ categoryId }) => {
  const categories = (await getContentsByCategorySlug())?.data
    ?.sort((a, b) => a.ordering - b.ordering)
    .filter((item) => item.active)
    .filter((item) => (categoryId ? '' + item.categoryId === categoryId : true))

  return (
    <div className='@container grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-7'>
      {categories?.map((category) => (
        <div key={category.id}>
          <Card
            withBorder
            shadow='sm'
            component={Link}
            href={`${category.redirect}/${category.slug}`}
            h={'100%'}
          >
            <CardSection>
              <AspectRatio ratio={16 / 9}>
                <Image
                  component={NextImage}
                  src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${category.params.image.value}`}
                  alt={category.title}
                  width={200}
                  height={200}
                  priority
                  placeholder='empty'
                />
              </AspectRatio>
            </CardSection>
            <Title
              order={3}
              pt={rem(10)}
              className='@xs:text-md text-sm @sm:text-lg'
            >
              {category.title}
            </Title>
          </Card>
        </div>
      ))}
    </div>
  )
}

export { CategoryContents }
