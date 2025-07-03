import styles from "./flightdata.module.css"

export default function FlightData(){
    return(
        <div className={styles.flightdata}>
            <div className={styles.maindataholder}>
            <div className={styles.maindata}>
                <p className={styles.dataheading}>Title</p>
                <h1 className={styles.datatxt}>0.00</h1>
            </div>
            <div className={styles.maindata}>
                <p className={styles.dataheading}>Title</p>
                <h1 className={styles.datatxt}>0.00</h1>
            </div>
            <div className={styles.maindata}>
                <p className={styles.dataheading}>Title</p>
                <h1 className={styles.datatxt}>0.00</h1>
            </div>
            <div className={styles.maindata}>
                <p className={styles.dataheading}>Title</p>
                <h1 className={styles.datatxt}>0.00</h1>
            </div>
            <div className={styles.maindata}>
                <p className={styles.dataheading}>Title</p>
                <h1 className={styles.datatxt}>0.00</h1>
            </div>
            <div className={styles.maindata}>
                <p className={styles.dataheading}>Title</p>
                <h1 className={styles.datatxt}>0.00</h1>
            </div>
        </div>
        <div className={styles.pos}>
            <h3>Position</h3>
            <p className={styles.alttxt}>33° 38' 34.839" N</p>
            <p className={styles.alttxt}>72° 59' 26.768" E</p>
        </div>
        <div className={styles.pos}>
            <h3>Heading</h3>
            <p className={styles.alttxt}>33° 38' 34.839" N</p>
            <p className={styles.alttxt}>72° 59' 26.768" E</p>
        </div>
        </div>
    )
}