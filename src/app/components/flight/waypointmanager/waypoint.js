import { use, useState } from "react";
import styles from "./waypoint.module.css"

export default function WaypointManager({waypoints, setWaypoints}){

    const [toggleModal, setModalToggle] = useState(false);

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
                <thead>
                    <tr>
                <th>ID</th>
                <th>Lat</th>
                <th>Long</th>
                <th>Alt</th>
                </tr>
                </thead>
                <tbody>
                    {tabledata}
                </tbody>
                </table>
            </div>
            <button className={styles.btn} onClick={() => setModalToggle(getToggleModal())}>Add New Waypoint</button>
        </div>
        <Modal toggleModal={toggleModal} setModalToggle={setModalToggle} waypoints={waypoints} setWaypoints={setWaypoints}></Modal>
        </>
    )
}

function Modal({toggleModal, setModalToggle, waypoints, setWaypoints}){

    const [wpId, setWpId] = useState(1);
    const [waypoint, setWaypoint] = useState({id:wpId});

    function validateInput(){
        console.log(waypoint.lat)
        if(waypoint.lat != undefined && waypoint.long != undefined && waypoint.alt != undefined) return true
        else return false
    }

    return(
        <div className={`${styles.modal} ${!toggleModal ? styles.hidden : ''}`}>
            <div className={styles.innermodal}>
                <div className={styles.input}><label>Latitude</label><input type="text" value={waypoint.lat} onChange={(e) => {setWaypoint({...waypoint, lat:e.target.value})}}></input></div>
                <div className={styles.input}><label>Longitude</label><input type="text" value={waypoint.long}  onChange={(e) => {setWaypoint({...waypoint, long:e.target.value})}}></input></div>
                <div className={styles.input}><label>Altitude</label><input type="text" value={waypoint.alt}  onChange={(e) => {setWaypoint({...waypoint, alt:e.target.value})}}></input></div>
                <button className={styles.btn} onClick={(e) => {
                if(validateInput()){
                    setWaypoints([...waypoints, waypoint])
                    setModalToggle(!toggleModal)
                    setWpId(wpId + 1)
                    setWaypoint({...waypoint, id:wpId + 1})
                }
                }
            }>Add New Waypoint</button>
            </div>
        </div>

    );
}