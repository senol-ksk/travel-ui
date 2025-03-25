import { Accordion } from '@mantine/core'
import { useState } from 'react'

const features = [
  {
    emoji: ' 🏨 ',
    value: 'Otel Özellikleri',
    description:
      'Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.',
  },
  {
    emoji: ' 🛏️ ',
    value: 'Otel Konsepti',
    description:
      'Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking.',
  },
  {
    emoji: ' 🍿 ',
    value: 'Snack Barlar',
    description:
      'Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries.',
  },
]

function FacilityProps() {
  const [opened, setOpened] = useState(features[0]?.value)

  return (
    <Accordion defaultValue={features[0]?.value}>
      {features.map((item) => (
        <Accordion.Item
          className='mt-3 rounded border bg-white md:p-3'
          key={item.value}
          value={item.value}
        >
          <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
          <Accordion.Panel>{item.description}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

export { FacilityProps }
