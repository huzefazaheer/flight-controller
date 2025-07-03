import styles from "./navbar.module.css"

export default function Navbar(){

    return(
        <nav className={styles.navbar}>
            <p className={styles.logo}>CSN</p>
            <div className={styles.status} ><img src="./status.svg" alt="" /><span className={styles.statustxt}>Status: Active</span></div>
            <div className={styles.right}>
                <p className={styles.weather}>Clear, 30 ºC</p>
                <p className={styles.time}>11:59 AM</p>
            </div>
        </nav>
    );
}