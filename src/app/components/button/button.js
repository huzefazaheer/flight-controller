import styles from "./button.module.css"

export default function MenuButton({title}){

    return(
        <button className={styles.menubutton}>{title}</button>
    );
}