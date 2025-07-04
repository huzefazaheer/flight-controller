import { useState } from "react";
import styles from "./waypoint.module.css"
import { AltButton } from "../../button/button";

export default function WaypointManager({waypoints, setWaypoints, coords}){

    const [toggleModal, setModalToggle] = useState(false);

    const tabledata = waypoints.map(wp => {
        return(
            <tr key={crypto.randomUUID()}>
                    <td>{wp.id}</td>
                    <td>{wp.lat}</td>
                    <td>{wp.lng}</td>
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
                <th>Lng</th>
                <th>Alt</th>
                </tr>
                </thead>
                <tbody>
                    {tabledata}
                </tbody>
                </table>
            </div>
            <AltButton title={"Add New Waypoint"} marginTop={"20%"} onClick={ ()=>{
                setModalToggle(!toggleModal)
                update()}}
                ></AltButton>
        </div>
        <WaypointToast toggleModal={toggleModal} setModalToggle={setModalToggle} waypoints={waypoints} setWaypoints={setWaypoints} coords={coords}></WaypointToast>
        </>
    )
}

function WaypointToast({toggleModal, setModalToggle, waypoints, setWaypoints, coords}){

    const [wpId, setWpId] = useState(1);
    const [newWaypoint, setNewWaypoint] = useState({id:wpId, lat:coords.lat, lng: coords.lng});
    const [prevCoord, setPrevCood] = useState(coords)
    const [errorMsg, setErrorMsg] = useState("")

    if(prevCoord !== coords){
        setPrevCood(coords)
        setNewWaypoint({...waypoint, id:wpId, lat:coords.lat, lng: coords.lng})
    }

    function validateInput(){
        if(newWaypoint.lat == undefined || newWaypoint.lat == ""){
            setErrorMsg("Please enter valid lat")
            return false
        }else if(newWaypoint.lng == undefined || newWaypoint.lng == ""){
            setErrorMsg("Please enter valid lng")
            return false
        }else if(newWaypoint.alt == undefined || newWaypoint.alt == ""){
            setErrorMsg("Please enter valid alt")
            return false
        }else{
            setErrorMsg("")
            return true
        }
    }

    return(
        <div className={`${styles.modal} ${!toggleModal ? styles.hidden : ''}`}>
            <div className={styles.innermodal}>
                <div className={styles.input}><label>Latitude</label><input type="text" value={newWaypoint.lat} onChange={(e) => {setNewWaypoint({...newWaypoint, lat:e.target.value})}}></input></div>
                <div className={styles.input}><label>Longitude</label><input type="text" value={newWaypoint.lng}  onChange={(e) => {setNewWaypoint({...newWaypoint, lng:e.target.value})}}></input></div>
                <div className={styles.input}><label>Altitude</label><input type="text" value={newWaypoint.alt}  onChange={(e) => {setNewWaypoint({...newWaypoint, alt:e.target.value})}}></input></div>
                <p className={styles.errormsg}>{errorMsg}</p>
                <AltButton title={"Confirm"} marginTop={"25%"} onClick={() => {
                if(validateInput()){
                    setWaypoints([...waypoints, newWaypoint])
                    setModalToggle(!toggleModal)
                    setWpId(wpId + 1)
                }}}></AltButton>
            </div>
        </div>

    );
}