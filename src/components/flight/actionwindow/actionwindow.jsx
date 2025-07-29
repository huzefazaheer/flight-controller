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
          title={'Button'}
          marginTop={'6%'}
          onClick={() => {
            console.log('========Status=========')
            console.log(fdata.statusData)
            console.log('========Waypoints=========')
            console.log(fdata.wpRef.current)
            console.log('========Active Waypoint=========')
            console.log(fdata.activewpRef.current)
          }}
        ></AltButton>
      </div>
      <h3 className={styles.subhead}>Status</h3>
      <div className={styles.sidedataholder}>
        <Data title={'Mode'} data={fdata.statusData.mode}></Data>
        <Data title={'Guided'} data={fdata.statusData.guided}></Data>
        <Data title={'Armed'} data={fdata.statusData.armed}></Data>
        <Data
          title={'Manual input'}
          data={fdata.statusData.manual_input}
        ></Data>
      </div>
      <h3 className={styles.subhead}>Waypoints</h3>
      <div className={styles.sidedataholder}>
        <Data
          title={'Number'}
          data={fdata.wpRef?.current?.length || '0'}
        ></Data>
      </div>
    </div>
  )
}

function Data({ col, title, data }) {
  return (
    <div className={styles.maindata} style={{ color: col }}>
      <p className={styles.dataheading}>{title}</p>
      <h1 className={styles.datatxt}>{data}</h1>
    </div>
  )
}
