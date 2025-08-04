import styles from './toast.module.css'

export default function Toast({ showToast, closeToast, h1, p1, p2 }) {
  return (
    <div className={`${styles.toast} ${showToast ? '' : styles.hidden}`}>
      <h3>{h1}</h3>
      <p>{p1}</p>
      <p>{p2}</p>
      <div className={styles.exit} onClick={() => closeToast()}>
        <img src="/cross.svg" alt="" />
      </div>
      <div
        key={crypto.randomUUID()}
        className={`${styles.progress} ${showToast ? styles.show : ''}`}
      ></div>
    </div>
  )
}
