import { useState } from 'react'
import styles from './waypoint.module.css'
import { AltButton } from '../../button/button'

export default function WaypointManager({
  waypoints,
  setWaypoints,
  coords,
  fdata,
  displayToast,
}) {
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
            displayToast(
              'Waypoints pushed successfully',
              'Sent to current mission',
              waypoints.length + ' waypoint(s)',
            )
          }}
        />
      </div>
      <WaypointModal
        toggleModal={toggleModal}
        setModalToggle={setModalToggle}
        waypoints={waypoints}
        setWaypoints={setWaypoints}
        coords={coords}
        setWpId={setWpId}
        wpId={wpId}
        setShowModal={setModalToggle}
      />
    </>
  )
}

function WaypointModal({
  toggleModal,
  setModalToggle,
  waypoints,
  setWaypoints,
  coords,
  setWpId,
  wpId,
  setShowModal,
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
      setErrorMsg('Please enter valid latitude')
      return false
    } else if (newWaypoint.lng == undefined || newWaypoint.lng == '') {
      setErrorMsg('Please enter valid longitude')
      return false
    } else if (newWaypoint.alt == undefined || newWaypoint.alt == '') {
      setErrorMsg('Please enter valid altitude')
      return false
    } else {
      setErrorMsg('')
      return true
    }
  }

  return (
    <div
      className={`${styles.modal} ${!toggleModal ? styles.modalhidden : ''}`}
    >
      <div className={styles.innermodal}>
        <div className={styles.input}>
          <h3>Add Waypoint</h3>
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
          marginTop={'1%'}
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
      <div className={styles.exit} onClick={() => setShowModal(false)}>
        <img src="cross.svg" alt="" />
      </div>
    </div>
  )
}
