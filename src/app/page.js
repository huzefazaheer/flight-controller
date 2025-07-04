"use client"

import styles from "./page.module.css";
import MenuButton from "./components/button/button";
import { useState } from "react";
import FlightData from "./components/flight/flightdata/flightdata";
import WaypointManager from "./components/flight/waypointmanager/waypoint";
import Map from "./components/map/map";

export default function Home() {

  const [waypoints, setWaypoints] = useState([]);
  const [coords, setCoords] = useState({lat:0,lng:0});
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
      {!mapMinimised ? <Map coords={coords} setCoords={setCoords} waypoints={waypoints} className={styles.img}></Map> : <img className={styles.img} src={"/live-feed.webp"} alt="" />}
    </div>
    <div className={styles.smallscreen}>
      {mapMinimised ? <Map coords={coords} setCoords={setCoords} waypoints={waypoints} className={styles.img}></Map> : <img className={styles.img} src={"/live-feed.webp"} alt="" />}
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
      {index == 0 ? <FlightData></FlightData> : <WaypointManager coords={coords} waypoints={waypoints} setWaypoints={setWaypoints }></WaypointManager>}
   </div>
   </div>
  );
}
