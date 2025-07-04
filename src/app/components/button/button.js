import styles from "./button.module.css"

export function MenuButton({title, onClick}){

    return(
        <button onClick={onClick} className={styles.menubutton}>{title}</button>
    );
}

export function AltButton({title, marginTop, onClick}){
    
    return(
        <button className={styles.altbtn} onClick={onClick} style={{marginTop:marginTop}}>{title}</button>
    );
}