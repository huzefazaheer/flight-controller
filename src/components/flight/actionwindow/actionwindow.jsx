import { AltButton } from '../../button/button'
import styles from './actionwindow.module.css'

export default function ActionWindow({ fdata, displayToast }) {
  return (
    <div className={styles.flightdata}>
      <div className={styles.maindataholder}>
        <AltButton
          title={'Takeoff'}
          onClick={async () => {
            await fdata.takeoff(5)
            displayToast(
              'Ardupilot',
              'Take off sequence initiated',
              'Altitude: 5',
            )
          }}
        ></AltButton>
        <AltButton
          title={'Land'}
          onClick={async () => {
            await fdata.land()
            displayToast('Ardupilot', 'Land sequence initiated')
          }}
        ></AltButton>
        <AltButton
          title={'Start Mission'}
          marginTop={'6%'}
          onClick={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            await fdata.startMission()
            displayToast('Ardupilot', 'Mission started', 'Attempting takeoff')
          }}
        ></AltButton>
        <AltButton
          title={'Dump Logs'}
          marginTop={'6%'}
          onClick={() => {
            displayToast('Dev Debug', 'Logs dumped to console')
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
