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
          title={'Arm'}
          marginTop={'6%'}
          onClick={() => {
            console.log('clicked')
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
