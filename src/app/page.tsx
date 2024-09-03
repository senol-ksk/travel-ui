import { useRef, sueeffect } from 'react'

const superFunction = (param: string) => parseFloat(param)

export default function Home() {
  return (
    <main>
      <h1>Hello</h1>
      <div>safasfsafasfs s s s s</div>
      <div>{superFunction(132)}</div>
    </main>
  )
}
