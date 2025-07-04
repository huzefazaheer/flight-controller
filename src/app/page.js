"use client"

import styles from "./page.module.css";
import MenuButton from "./components/button/button";
import { useState } from "react";
import FlightData from "./components/flight/flightdata/flightdata";
import WaypointManager from "./components/flight/waypointmanager/waypoint";
import Map from "./components/map/map";

export default function Home() {

  const [mapMinimised, setMapMinimised] = useState(false);
  const [index, setIndex] = useState(0);

  function toggleMap(){
    if(mapMinimised) return false;
    else return true;
  }

  return (
   <div className={styles.wrapper}>
   <div className={styles.screen}>
    <div className={styles.bigscreen} >
      <Map className={styles.img}></Map>
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
      <MenuButton title="Flight Data" onClick={() => setIndex(0)}></MenuButton>
      <MenuButton title="Waypoint Manager" onClick={() => setIndex(1)}></MenuButton>
      <MenuButton title="Command Prompt" onClick={() => setIndex(2)}></MenuButton>
      <MenuButton title="Logs" onClick={() => setIndex(3)}></MenuButton>
      </div>
      {index == 0 ? <FlightData></FlightData> : <WaypointManager></WaypointManager>}
   </div>
   </div>
  );
}
