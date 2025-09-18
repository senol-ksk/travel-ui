'use client'
type CyprusDetailClientProps = {
  hotelInformation: string
}

export const CyprusDetailClient: React.FC<CyprusDetailClientProps> = ({
  hotelInformation,
}) => {
  return (
    <>
      <div>
        <div
          style={{
            maxHeight: '100px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div>
            <div
              className='text-sm'
              dangerouslySetInnerHTML={{
                __html: hotelInformation.trim(),
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
