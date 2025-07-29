import { useState, useEffect, useRef, useCallback } from 'react'
import ROSLIB from 'roslib'

const initTel = {
  lat: 0,
  lng: 0,
  alt: 0,
  battery_percentage: 'N\\A',
  timestamp: 'N\\A',
  heading: 'N\\A',
  gspeed: 0,
  vspeed: 0,
  yaw: 0,
  disttowp: 0,
  etatowp: 0,
}

const useRosConnection = (url = 'ws://localhost:9090') => {
  const [isConnected, setIsConnected] = useState(false)
  const [statusData, setStatusData] = useState({
    status: 'Disconnected',
    bat: 0.0,
  })
  const [telemetryData, setTelemetryData] = useState(initTel)
  const [cameraFeed, setCameraFeed] = useState(null)
  const [error, setError] = useState(null)
  const activewpRef = useRef(null)
  const speedRef = useRef(null)
  const posRef = useRef(null)
  const rosRef = useRef(null)
  const missionPushClientRef = useRef(null)
  const topicRefs = useRef([])
  const takeoffClientRef = useRef(null)
  const armingClientRef = useRef(null)
  const setModeClientRef = useRef(null)
  const landClientRef = useRef(null)
  const wpRef = useRef(null)

  // Helper function to set mode
  const setMode = useCallback(async (mode = 'GUIDED') => {
    if (!setModeClientRef.current) {
      return { success: false, error: 'SetMode service not ready' }
    }

    try {
      const request = new ROSLIB.ServiceRequest({
        custom_mode: mode,
      })
      const response = await setModeClientRef.current.callService(request)
      return {
        success: response?.mode_sent || false,
        message: response?.message || 'No response message',
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  const arm = useCallback(async (shouldArm = true) => {
    if (!armingClientRef.current) {
      return { success: false, error: 'Arming service not ready' }
    }

    try {
      const request = new ROSLIB.ServiceRequest({
        value: shouldArm,
      })
      const response = await armingClientRef.current.callService(request)
      return {
        success: response?.success || false,
        message: response?.message || 'No response message',
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  const takeoff = useCallback(
    async (altitude = 10) => {
      if (!takeoffClientRef.current) {
        return { success: false, error: 'Takeoff service not ready' }
      }
      await setMode('GUIDED')
      await arm(true)

      // 3. Send takeoff command
      try {
        const request = new ROSLIB.ServiceRequest({
          min_pitch: 0, // Usually 0 for multirotors
          yaw: 0, // Heading (radians)
          latitude: 0, // Ignored in GUIDED mode
          longitude: 0, // Ignored in GUIDED mode
          altitude: altitude, // Takeoff altitude (meters)
        })

        const response = await takeoffClientRef.current.callService(request)

        if (response?.success) {
          return { success: true, message: 'Takeoff command accepted' }
        } else {
          return {
            success: false,
            error: response?.message || 'Takeoff failed with no error message',
          }
        }
      } catch (err) {
        return { success: false, error: err.message }
      }
    },
    [setMode, arm],
  )

  const land = useCallback(async () => {
    if (!landClientRef.current) {
      return { success: false, error: 'Landing service not ready' }
    }

    try {
      const request = new ROSLIB.ServiceRequest({
        altitude: 0, // Land at current position
        latitude: 0, // Ignored when landing at current position
        longitude: 0, // Ignored when landing at current position
        min_pitch: 0, // Usually 0 for multirotors
        yaw: 0, // Maintain current heading
      })

      const response = await landClientRef.current.callService(request)

      if (response?.success) {
        // Verify landing by monitoring altitude
        return new Promise((resolve) => {
          // const startAlt = telemetryData.alt
          const checkInterval = setInterval(() => {
            if (telemetryData.alt < 0.5) {
              // Consider landed below 0.5m
              clearInterval(checkInterval)
              resolve({ success: true, message: 'Landed successfully' })
            }
          }, 1000)

          // Timeout after 60 seconds
          setTimeout(() => {
            clearInterval(checkInterval)
            resolve({
              success: false,
              error: `Landing verification timeout. Current alt: ${telemetryData.alt}m`,
            })
          }, 60000)
        })
      }
      return {
        success: false,
        error: response?.message || 'Land command rejected',
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [telemetryData.alt])

  const clearMission = async () => {
    const clearClient = new ROSLIB.Service({
      ros: rosRef.current,
      name: '/mavros/mission/clear',
      serviceType: 'mavros_msgs/WaypointClear',
    })

    const request = new ROSLIB.ServiceRequest({})
    await clearClient.callService(request)
  }

  const pushWaypoints = useCallback(async (waypoints) => {
    if (!missionPushClientRef.current || waypoints.length === 0) {
      console.error('Service not ready or no waypoints')
      return { success: false, error: 'Service not ready or no waypoints' }
    }
    const takeoffWp = {
      frame: 3, // MAV_FRAME_GLOBAL
      command: 22, // MAV_CMD_NAV_TAKEOFF (MAVLink command for takeoff)
      is_current: true, // This will be the first and current waypoint
      autocontinue: true,
      param1: 0, // Minimum pitch (usually 0 for multirotors)
      param2: 0, // Empty
      param3: 0, // Empty
      param4: 0, // Yaw (0 for no specific yaw during takeoff)
      x_lat: parseFloat(waypoints[0].lat), // Takeoff at current latitude
      y_long: parseFloat(waypoints[0].lng), // Takeoff at current longitude
      z_alt: 10, // Target takeoff altitude
    }
    await clearMission()
    wpRef.current = waypoints
    const rosWaypoints = [
      takeoffWp,
      ...waypoints.map((wp, index) => ({
        frame: wp.frame || 3, // MAV_FRAME_GLOBAL
        command: wp.command || 16, // MAV_CMD_NAV_WAYPOINT
        is_current: index === 0, // First waypoint in reversed list is current
        autocontinue: wp.autocontinue !== false,
        param1: 2.0,
        param2: wp.param2 || 0,
        param3: wp.param3 || 0,
        param4: wp.param4 || 0,
        x_lat: parseFloat(wp.lat),
        y_long: parseFloat(wp.lng),
        z_alt: parseFloat(wp.alt),
      })),
    ]

    console.log(rosWaypoints)

    const request = new ROSLIB.ServiceRequest({ waypoints: rosWaypoints })

    try {
      const result = await missionPushClientRef.current.callService(request)
      const success = result?.success ?? true
      const count = result?.wp_transfered ?? waypoints.length

      if (success) {
        console.log(`Successfully pushed ${count} waypoints`)
        return { success: true, count }
      } else {
        console.warn('Waypoint push reported failure', result)
        return { success: false, error: 'Service reported failure' }
      }
    } catch (err) {
      console.error('Service call failed:', err)
      return { success: false, error: err.message }
    }
  }, [])

  const startMission = useCallback(async () => {
    if (!setModeClientRef.current) {
      return { success: false, error: 'ROS service not connected' }
    }
    await setMode('AUTO')
    await setCurrentWaypoint(0)
  }, [])

  const setCurrentWaypoint = async (index = 0) => {
    const setCurrentClient = new ROSLIB.Service({
      ros: rosRef.current,
      name: '/mavros/mission/set_current',
      serviceType: 'mavros_msgs/WaypointSetCurrent',
    })

    const request = new ROSLIB.ServiceRequest({ wp_seq: index })
    await setCurrentClient.callService(request)
  }

  useEffect(() => {
    if (!rosRef.current) {
      rosRef.current = new ROSLIB.Ros({ url })

      // Initialize service client when connection is established
      const onConnection = () => {
        console.log('Connected to rosbridge_server.')
        setIsConnected(true)
        setError(null)
        setStatusData((prev) => ({ ...prev, status: 'Active' }))

        // Initialize landing service
        landClientRef.current = new ROSLIB.Service({
          ros: rosRef.current,
          name: '/mavros/cmd/land',
          messageType: 'mavros_msgs/CommandTOL',
        })

        // Initialize mission push service
        missionPushClientRef.current = new ROSLIB.Service({
          ros: rosRef.current,
          name: '/mavros/mission/push', // Changed to standard MAVROS service name
          serviceType: 'mavros_msgs/WaypointPush',
        })

        // Initialize services
        takeoffClientRef.current = new ROSLIB.Service({
          ros: rosRef.current,
          name: '/mavros/cmd/takeoff',
          serviceType: 'mavros_msgs/CommandTOL',
        })

        armingClientRef.current = new ROSLIB.Service({
          ros: rosRef.current,
          name: '/mavros/cmd/arming',
          serviceType: 'mavros_msgs/CommandBool',
        })

        setModeClientRef.current = new ROSLIB.Service({
          ros: rosRef.current,
          name: '/mavros/set_mode',
          serviceType: 'mavros_msgs/SetMode',
        })

        // Setup topics
        const topics = [
          {
            name: '/mavros/vfr_hud',
            type: 'mavros_msgs/VFR_HUD',
            callback: (message) => {
              function calculateDistance(lat1, lon1, lat2, lon2) {
                // Convert degrees to radians
                const toRad = (deg) => deg * (Math.PI / 180)

                const R = 6371e3 // Earth radius in meters
                const φ1 = toRad(lat1)
                const φ2 = toRad(lat2)
                const Δφ = toRad(lat2 - lat1)
                const Δλ = toRad(lon2 - lon1)

                // Haversine formula
                const a =
                  Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) *
                    Math.cos(φ2) *
                    Math.sin(Δλ / 2) *
                    Math.sin(Δλ / 2)
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                return R * c // Distance in meters
              }
              const distance = calculateDistance(
                Number(activewpRef.current.x_lat),
                Number(activewpRef.current.y_long),
                Number(posRef.current[0]),
                Number(posRef.current[1]),
              )
              const eta = Math.round(distance / message.groundspeed / 60)
              speedRef.current = message.groundspeed
              let displayDistance =
                distance < 1000
                  ? Math.round(distance)
                  : Math.round(distance / 1000)
              setTelemetryData((prev) => ({
                ...prev,
                gspeed: message.groundspeed,
                vspeed: message.climb,
                yaw: message.heading,
                disttowp: displayDistance,
                etatowp: eta,
              }))
            },
          },
          {
            name: '/mavros/global_position/global',
            type: 'sensor_msgs/NavSatFix',
            callback: (message) => {
              posRef.current = [message.latitude, message.longitude]
              setTelemetryData((prev) => ({
                ...prev,
                lat: message.latitude,
                lng: message.longitude,
                alt: message.altitude,
              }))
            },
          },
          {
            name: '/webcam/image_raw/compressed',
            type: 'sensor_msgs/CompressedImage',
            callback: (message) => {
              setCameraFeed('data:image/jpeg;base64,' + message.data)
            },
          },
          {
            name: '/mavros/mission/waypoints',
            type: 'mavros_msgs/WaypointList',
            callback: (message) => {
              console.log('All Wps', message.waypoints)
              activewpRef.current = message.waypoints.find(
                (wp) => wp.is_current,
              )
            },
          },
          {
            name: '/mavros/mission/reached',
            type: 'mavros_msgs/WaypointReached',
            callback: (message) => {
              console.log('Reached', message)
              if (message.wp_seq === wpRef.length - 1) {
                setCurrentWaypoint(0)
              }
            },
          },
        ]

        // Store topic references for cleanup
        topicRefs.current = topics.map((topicConfig) => {
          const topic = new ROSLIB.Topic({
            ros: rosRef.current,
            name: topicConfig.name,
            messageType: topicConfig.type,
          })
          topic.subscribe(topicConfig.callback)
          return topic
        })
      }

      rosRef.current.on('connection', onConnection)
      rosRef.current.on('error', (err) => {
        console.error('Error connecting to rosbridge_server:', err)
        setIsConnected(false)
        setError(err)
      })
      rosRef.current.on('close', () => {
        console.log('Disconnected from rosbridge_server.')
        setIsConnected(false)
        setTelemetryData(initTel)
        setCameraFeed(null)
        setStatusData({ status: 'Disconnected', bat: 0.0 })
      })
    }

    return () => {
      // Unsubscribe from all topics
      topicRefs.current.forEach((topic) => topic.unsubscribe())
      topicRefs.current = []

      // Close ROS connection
      if (rosRef.current && rosRef.current.isConnected) {
        rosRef.current.close()
      }
    }
  }, [url])

  return {
    isConnected,
    statusData,
    telemetryData,
    cameraFeed,
    error,
    ros: rosRef.current,
    pushWaypoints,
    posRef,
    takeoff,
    land,
    startMission,
  }
}

export default useRosConnection
