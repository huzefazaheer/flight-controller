import styles from "./flightdata.module.css"

export default function FlightData(){
    return(
        <div className={styles.flightdata}>
            <div className={styles.maindataholder}>
            <Data col={"#F179C3"} title={"Alt (m)"} data={"0.00"}></Data>
            <Data col={"#FF990A"} title={"G Speed (km/h"} data={"0.00"}></Data>
            <Data col={"#FF4747"} title={"DistToWp (m)"} data={"0.00"}></Data>
            <Data col={"#EBFF0A"} title={"V Speed (km/h)"} data={"0.00"}></Data>
            <Data col={"#5ECFFF"} title={"DistToMav"} data={"0.00"}></Data>
            <Data col={"#4DFF11"} title={"Yaw (deg)"} data={"0.00"}></Data>
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

function Data({col, title, data}){
    return(
        <div  className={styles.maindata} style={{ color: col }}>
                <p className={styles.dataheading}>{title}</p>
                <h1 className={styles.datatxt}>{data}</h1>
            </div>
    )
}