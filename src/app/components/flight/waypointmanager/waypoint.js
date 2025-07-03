import { use, useState } from "react";
import styles from "./waypoint.module.css"

export default function WaypointManager(){

    const [toggleModal, setModalToggle] = useState(false);

    const [waypoints, setWaypoints] = useState([]);

    function getToggleModal(){
        if(toggleModal) return false;
        else return true;
    }

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
        <>
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
            </table>
            </div>
            <button className={styles.btn} onClick={() => setModalToggle(getToggleModal())}>Add New Waypoint</button>
        </div>
        <Modal toggleModal={toggleModal} setModalToggle={setModalToggle} waypoints={waypoints} setWaypoints={setWaypoints}></Modal>
        </>
    )
}

function Modal({toggleModal, setModalToggle, waypoints, setWaypoints}){

    const [waypoint, setWaypoint] = useState({});
    const [wpId, setWpId] = useState(0);

    function getToggleModal(){
        if(toggleModal) return false;
        else return true;
    }

    return(
        <div className={`${styles.modal} ${toggleModal ? styles.hidden : ''}`}>
            <div className={styles.innermodal}>
                <div className={styles.input}><label>Latitude</label><input type="text" value={waypoint.lat} onChange={(e) => {setWaypoint({...waypoint, lat:e.target.value})}}></input></div>
                <div className={styles.input}><label>Longitude</label><input type="text" value={waypoint.long}  onChange={(e) => {setWaypoint({...waypoint, long:e.target.value})}}></input></div>
                <div className={styles.input}><label>Altitude</label><input type="text" value={waypoint.alt}  onChange={(e) => {setWaypoint({...waypoint, alt:e.target.value})}}></input></div>
                <button className={styles.btn} onClick={(e) => {
                setWaypoint({...waypoint, id:wpId})
                setWpId(wpId + 1)
                setWaypoints([...waypoints, waypoint])
                setModalToggle(getToggleModal())}
            }>Add New Waypoint</button>
            </div>
        </div>

    );
}