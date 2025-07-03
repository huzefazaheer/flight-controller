import { use, useState } from "react";
import styles from "./waypoint.module.css"

export default function WaypointManager(){

    const [toggleModal, setModalToggle] = useState(false);

    const [waypoints, setWaypoints] = useState([]);
    const [wpId, setWpId] = useState(0);

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

    function getToggleModal(){
        if(toggleModal) return false;
        else return true;
    }

    return(
        <div className={`${styles.modal} ${toggleModal ? styles.hidden : ''}`}>
            <button className={styles.btn} onClick={(e) => {
                setWaypoints([...waypoints, {id:4, lat:5.223132, long:4.555321, alt: 55}])
                setModalToggle(getToggleModal())}
            }>Add New Waypoint</button>
        </div>

    );
}