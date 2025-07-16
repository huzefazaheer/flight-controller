import styles from "./page.module.css";
import {MenuButton} from "../../components/button/button";
import { useEffect, useState } from "react";
import FlightData from "../../components/flight/flightdata/flightdata";
import WaypointManager from "../../components/flight/waypointmanager/waypoint";
import Map from "../../components/map/map";
import useRosConnection from "../../script";

export default function Home({fdata}) {

  const [waypoints, setWaypoints] = useState([]);
  const [coords, setCoords] = useState({lat:0,lng:0});
  const [mapMinimised, setMapMinimised] = useState(false);
  const [index, setIndex] = useState(0);

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
        <img src="/maximise.svg" alt="" onClick={() => {setMapMinimised(!mapMinimised);}}/>
      </div>
    </div>
   </div>
   <div className={styles.rightmenu} >
    <div className={styles.options}>
      <MenuButton title="Flight Data" onClick={() => setIndex(0)} isActive={index == 0 ? true : false}></MenuButton>
      <MenuButton title="Waypoint Manager" onClick={() => setIndex(1)} isActive={index == 1 ? true : false}></MenuButton>
      <MenuButton title="Command Prompt" onClick={() => setIndex(2)} isActive={index == 2 ? true : false}></MenuButton>
      <MenuButton title="Logs" onClick={() => setIndex(3)} isActive={index == 3 ? true : false}></MenuButton>
      </div>
      {index == 0 ? <FlightData fdata={fdata}></FlightData> : <WaypointManager coords={coords} waypoints={waypoints} setWaypoints={setWaypoints }></WaypointManager>}
   </div>
   </div>
  );
}
