import styles from "./button.module.css"

export default function MenuButton({title, onClick}){

    return(
        <button onClick={onClick} className={styles.menubutton}>{title}</button>
    );
}