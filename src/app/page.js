import Image from "next/image";
import styles from "./page.module.css";
import MenuButton from "./components/button/button";

export default function Home() {
  return (
   <div className={styles.wrapper}>
   <div className={styles.screen}>
    <img className={styles.bigscreen} src="/live-map.png" alt="" />
    <img className={styles.smallscreen} src="/live-feed.webp" alt="" />
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
