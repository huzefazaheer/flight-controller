import { useState, useRef, useEffect } from 'react'
import styles from './waypoint.module.css'
import { AltButton } from '../../button/button'
import ROSLIB from 'roslib'

export default function WaypointManager({
  waypoints,
  setWaypoints,
  coords,
  fdata,
}) {
  const [showToast, setShowToast] = useState(false)
  const [toggleModal, setModalToggle] = useState(false)
  const [wpId, setWpId] = useState(1)

  function removeWp(id) {
    setWpId((prevWpId) => prevWpId - 1)
    setWaypoints(waypoints.filter((wp) => wp.id !== id))
  }

  const tabledata = waypoints.map((wp) => (
    <tr key={wp.id} onClick={() => removeWp(wp.id)}>
      <td>{wp.no}</td>
      <td>{wp.lat}</td>
      <td>{wp.lng}</td>
      <td>{wp.alt}</td>
    </tr>
  ))

  return (
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
            <tbody>{tabledata}</tbody>
          </table>
        </div>
        <AltButton
          title={'Add New Waypoint'}
          marginTop={'10%'}
          onClick={() => setModalToggle(!toggleModal)}
        />
        <AltButton
          marginTop={'5%'}
          title={'Push Waypoints'}
          onClick={() => {
            fdata.pushWaypoints(waypoints)
            setShowToast(true)
            setTimeout(() => {
              setShowToast(false)
            }, 1500)
          }}
        />
      </div>
      <WaypointToast
        toggleModal={toggleModal}
        setModalToggle={setModalToggle}
        waypoints={waypoints}
        setWaypoints={setWaypoints}
        coords={coords}
        setWpId={setWpId}
        wpId={wpId}
      />
      <Toast
        message={'Waypoints pushed successfully'}
        showToast={showToast}
      ></Toast>
    </>
  )
}

function Toast({ message, showToast }) {
  return (
    <div className={`${styles.toast} ${showToast ? '' : styles.hidden}`}>
      <h3>{message}</h3>
      <p>Sent to current mission</p>
      {/* <p>{'Longitude: ' + coords.lng}</p> */}
    </div>
  )
}

function WaypointToast({
  toggleModal,
  setModalToggle,
  waypoints,
  setWaypoints,
  coords,
  setWpId,
  wpId,
}) {
  const [newWaypoint, setNewWaypoint] = useState({
    lat: coords.lat,
    lng: coords.lng,
  })
  const [prevCoord, setPrevCood] = useState(coords)
  const [errorMsg, setErrorMsg] = useState('')

  if (prevCoord != coords) {
    setPrevCood(coords)
    setNewWaypoint({ ...newWaypoint, lat: coords.lat, lng: coords.lng })
  }

  function validateInput() {
    if (newWaypoint.lat == undefined || newWaypoint.lat == '') {
      setErrorMsg('Please enter valid lat')
      return false
    } else if (newWaypoint.lng == undefined || newWaypoint.lng == '') {
      setErrorMsg('Please enter valid lng')
      return false
    } else if (newWaypoint.alt == undefined || newWaypoint.alt == '') {
      setErrorMsg('Please enter valid alt')
      return false
    } else {
      setErrorMsg('')
      return true
    }
  }

  return (
    <div className={`${styles.modal} ${!toggleModal ? styles.hidden : ''}`}>
      <div className={styles.innermodal}>
        <div className={styles.input}>
          <label>Latitude</label>
          <input
            type="text"
            value={newWaypoint.lat}
            onChange={(e) => {
              setNewWaypoint({ ...newWaypoint, lat: e.target.value })
            }}
          ></input>
        </div>
        <div className={styles.input}>
          <label>Longitude</label>
          <input
            type="text"
            value={newWaypoint.lng}
            onChange={(e) => {
              setNewWaypoint({ ...newWaypoint, lng: e.target.value })
            }}
          ></input>
        </div>
        <div className={styles.input}>
          <label>Altitude</label>
          <input
            type="text"
            value={newWaypoint.alt}
            onChange={(e) => {
              setNewWaypoint({ ...newWaypoint, alt: e.target.value })
            }}
          ></input>
        </div>
        <p className={styles.errormsg}>{errorMsg}</p>
        <AltButton
          title={'Confirm'}
          marginTop={'25%'}
          onClick={() => {
            if (validateInput()) {
              setWpId((prevId) => prevId + 1)
              setWaypoints([
                ...waypoints,
                { ...newWaypoint, no: wpId + 1, id: crypto.randomUUID() },
              ])
              setModalToggle(!toggleModal)
            }
          }}
        ></AltButton>
      </div>
    </div>
  )
}
