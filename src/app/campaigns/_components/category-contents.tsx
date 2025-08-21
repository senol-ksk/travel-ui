import { getContentsByCategorySlug } from '@/libs/cms-data'
import {
  AspectRatio,
  Card,
  CardSection,
  Image,
  rem,
  Title,
} from '@mantine/core'
import { Route } from 'next'
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
    <div className='@container grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-7'>
      {categories?.map((category) => (
        <div key={category.id}>
          <Card
            radius={'md'}
            component={Link}
            href={`${category.redirect}/${category.slug}` as Route}
            h={'100%'}
          >
            <CardSection>
              <AspectRatio ratio={16 / 9}>
                <Image
                  component={NextImage}
                  src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${category.params.image.value}`}
                  alt={category.title}
                  width={550}
                  height={550}
                  priority
                  radius={'md'}
                  placeholder='empty'
                />
              </AspectRatio>
            </CardSection>
            <Title
              pt={rem(10)}
              className='@xs:text-md px-0 text-start text-lg @sm:text-lg'
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
