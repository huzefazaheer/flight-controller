import { AltButton } from '../../button/button'
import styles from './logdata.module.css'

export default function LogData({ fdata }) {
  const data = fdata.logData.map((data) => {
    return (
      <p className={styles.log} key={crypto.randomUUID()}>
        {data}
      </p>
    )
  })
  return (
    <div className={styles.dataholder}>
      <h3>Ardupilot Logs</h3>
      <div className={styles.logs}>{data}</div>
      <AltButton
        title={'Clear logs'}
        marginTop={'20px'}
        onClick={() => {
          fdata.setLogData([])
        }}
      ></AltButton>
    </div>
  )
}
