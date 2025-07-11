import styles from "./button.module.css"

export function MenuButton({title, onClick, isActive = false}){

    return(
        <button onClick={onClick} className={`${styles.menubutton} ${isActive ? styles.menubuttonactive : "" }`}>{title}</button>
    );
}

export function AltButton({title, marginTop, onClick}){
    
    return(
        <button className={styles.altbtn} onClick={onClick} style={{marginTop:marginTop}}>{title}</button>
    );
}