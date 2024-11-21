import { Button } from '@mantine/core'

const TestPage = () => {
  return (
    <div>
      <form
        action={'/reservation/callback/api?paymenttoken=638672538284407534'}
        method='POST'
      >
        <input name='txnCode' defaultValue='1000' />
        <input name='responseCode' defaultValue='VPS-0000' />
        <input name='responseMessage' defaultValue='BAŞARILI' />
        <input name='hostResponseCode' defaultValue='00' />
        <input name='hostMessage' defaultValue='000 ONAY KODU XXXXXX' />
        <input name='txnDateTime' defaultValue='2024-11-14T17:49:47.000' />
        <input
          name='merchantSafeId'
          defaultValue='2023090417500272654BD9A49CF07574'
        />
        <input
          name='terminalSafeId'
          defaultValue='2023090417500284633D137A249DBBEB'
        />
        <input name='cardHolderName' defaultValue='EK*** AK***' />
        <input
          name='orderId'
          defaultValue='5a5bb508-389a-46c4-9ec2-968af3ebac33'
        />
        <input name='authCode' defaultValue='067507' />
        <input name='rrn' defaultValue='432024591615' />
        <input name='batchNumber' defaultValue='290' />
        <input name='stan' defaultValue='45' />
        <input name='additionalInstallCount' defaultValue='0' />
        <input name='deferingMonth' defaultValue='2' />
        <input name='ccbEarnedRewardAmount' defaultValue='8.00' />
        <input name='ccbBalanceRewardAmount' defaultValue='659134.84' />
        <input name='ccbRewardDesc' defaultValue='CHIP PARA' />
        <input name='pcbEarnedRewardAmount' defaultValue='0.00' />
        <input name='pcbBalanceRewardAmount' defaultValue='0.00' />
        <input name='pcbRewardDesc' defaultValue='' />
        <input name='xcbEarnedRewardAmount' defaultValue='0.00' />
        <input name='xcbBalanceRewardAmount' defaultValue='0.00' />
        <input name='xcbRewardDesc' defaultValue='' />
        <input
          name='hashParams'
          defaultValue='txnCode+responseCode+responseMessage+hostResponseCode+hostMessage+txnDateTime+merchantSafeId+terminalSafeId+orderId+cardHolderName+authCode+rrn+batchNumber+stan+additionalInstallCount+deferingMonth+ccbEarnedRewardAmount+ccbBalanceRewardAmount+ccbRewardDesc+pcbEarnedRewardAmount+pcbBalanceRewardAmount+xcbEarnedRewardAmount+xcbBalanceRewardAmount'
        />
        <input
          name='hash'
          defaultValue='etRF1OgSP0dlGsVLQac+PYLHoYiVrtwPqKdQKgRYsnYus9u8dT/fUMLKCG9V/Q2x/4aDOABCtfzka1Zq3xr60A=='
        />
        <div>
          <Button type='submit'>Submit</Button>
        </div>
      </form>
    </div>
  )
}

export default TestPage
