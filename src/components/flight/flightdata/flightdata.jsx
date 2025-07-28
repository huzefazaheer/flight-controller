import styles from './flightdata.module.css'

export default function FlightData({ fdata }) {
  return (
    <div className={styles.flightdata}>
      <div className={styles.maindataholder}>
        <Data
          col={'#F179C3'}
          title={'Alt (m)'}
          data={Math.round(fdata.telemetryData.alt * 100) / 100 || 0}
        ></Data>
        <Data
          col={'#FF990A'}
          title={'G Speed (km/h)'}
          data={Math.round(fdata.telemetryData.gspeed * 100) / 100 || 0}
        ></Data>
        <Data
          col={'#FF4747'}
          title={'DistToWp (m)'}
          data={Math.round(fdata.telemetryData.disttowp * 100) / 100 || 0}
        ></Data>
        <Data
          col={'#EBFF0A'}
          title={'V Speed (km/h)'}
          data={Math.round(fdata.telemetryData.vspeed * 100) / 100 || 0}
        ></Data>
        <Data
          col={'#5ECFFF'}
          title={'ETA To WP (min)'}
          data={fdata.telemetryData.etatowp || '∞'}
        ></Data>
        <Data
          col={'#4DFF11'}
          title={'Yaw (deg)'}
          data={Math.round(fdata.telemetryData.yaw * 100) / 100 || 0}
        ></Data>
      </div>
      <div className={styles.pos}>
        <h3>Position</h3>
        <p className={styles.alttxt}>{fdata.telemetryData.lat} N</p>
        <p className={styles.alttxt}>{fdata.telemetryData.lng} E</p>
      </div>
      {/* <div className={styles.pos}>
        <h3>Heading</h3>
        <p className={styles.alttxt}>{fdata.telemetryData.heading} º</p>
      </div> */}
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
