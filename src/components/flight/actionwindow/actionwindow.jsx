import { AltButton } from '../../button/button'
import styles from './actionwindow.module.css'

export default function ActionWindow({ fdata }) {
  return (
    <div className={styles.flightdata}>
      <div className={styles.maindataholder}>
        <AltButton
          title={'Takeoff'}
          onClick={async () => {
            await fdata.takeoff(5)
          }}
        ></AltButton>
        <AltButton
          title={'Land'}
          onClick={async () => {
            await fdata.land()
          }}
        ></AltButton>
        <AltButton
          title={'Start Mission'}
          marginTop={'6%'}
          onClick={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            await fdata.startMission()
          }}
        ></AltButton>
        <AltButton
          title={'Guided'}
          marginTop={'6%'}
          onClick={() => {
            console.log('clicked')
          }}
        ></AltButton>
      </div>
    </div>
  )
}
