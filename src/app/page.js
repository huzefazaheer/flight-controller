"use client"

import styles from "./page.module.css";
import MenuButton from "./components/button/button";
import { useState } from "react";

export default function Home() {

  const [mapMinimised, setMapMinimised] = useState(false);

  function toggleMap(){
    if(mapMinimised) return false;
    else return true;
  }

  return (
   <div className={styles.wrapper}>
   <div className={styles.screen}>
    <div className={styles.bigscreen} >
      <img className={styles.img} src={!mapMinimised ? "/live-map.png" : "/live-feed.webp"} alt="" />
    </div>
    <div className={styles.smallscreen}>
      <img className={styles.img} src={mapMinimised ? "/live-map.png" : "/live-feed.webp"} alt="" />
      <div className={styles.controls}>
        <p>{!mapMinimised ? "Live Feed" : "Map"}</p>
        <img src="/maximise.svg" alt="" onClick={(e) => {setMapMinimised(toggleMap());}}/>
      </div>
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
