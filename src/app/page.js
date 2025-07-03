import styles from "./page.module.css";
import MenuButton from "./components/button/button";

export default function Home() {
  return (
   <div className={styles.wrapper}>
   <div className={styles.screen}>
    <div className={styles.bigscreen} >
      <img className={styles.img} src="/live-map.png" alt="" />
    </div>
    <div className={styles.smallscreen}>
      <img className={styles.img} src="/live-feed.webp" alt="" />
    </div>
   </div>
   <div className={styles.rightmenu} >
    <div className={styles.options}>
      <MenuButton title="Flight Data"></MenuButton>
      <MenuButton title="Waypoint Manager"></MenuButton>
      <MenuButton title="Command Prompt"></MenuButton>
      <MenuButton title="Logs"></MenuButton>
      </div>
   </div>

   </div>
  );
}
