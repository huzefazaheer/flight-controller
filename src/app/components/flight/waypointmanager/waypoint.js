import { use, useState } from "react";
import styles from "./waypoint.module.css"

export default function WaypointManager(){

    const [waypoints, setWaypoints] = useState([]);
    const [wpId, setWpId] = useState(0);

    const tabledata = waypoints.map(wp => {
        return(
            <tr key={crypto.randomUUID()}>
                    <td>{wp.id}</td>
                    <td>{wp.lat}</td>
                    <td>{wp.long}</td>
                    <td>{wp.alt}</td>
            </tr>
        );
    })

    return(
        <div className={styles.waypoint}>
            <h3>Current Waypoints</h3>
            <div className={styles.tablewrapper}>
                 <table>
                <tr>
                <th>ID</th>
                <th>Lat</th>
                <th>Long</th>
                <th>Alt</th>
                </tr>
                {tabledata}
                {/* <tr>
                    <td>1</td>
                    <td>5.272838</td>
                    <td>6.3163127</td>
                    <td>100</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>5.233000</td>
                    <td>5.3103666</td>
                    <td>400</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>6.653321</td>
                    <td>7.3553167</td>
                    <td>129</td>
                </tr> */}
            </table>
            </div>
            <button className={styles.btn} onClick={(e) => {setWaypoints([...waypoints, {id:4, lat:5.223132, long:4.555321, alt: 55}])}}>Add New Waypoint</button>
        </div>
    )
}