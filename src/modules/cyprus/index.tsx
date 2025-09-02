import { CyprusSearchEnginePackagesCheck } from './package-checks/package-checks'

const CyprusSearchEngine = () => {
  return (
    <div>
      <div className='leading-md text-sm'>
        Seyahatinizi oluşturmak için bir paket seçin
      </div>
      <CyprusSearchEnginePackagesCheck
        selectedPackages={['1']}
        onChange={(value) => {
          console.log(value)
        }}
      />
    </div>
  )
}

export { CyprusSearchEngine }
