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
  const posRef = useRef([33.6844, 73.0479])
  const rosRef = useRef(null)
  const missionPushClientRef = useRef(null)
  const topicRefs = useRef([])

  const pushWaypoints = useCallback(async (waypoints) => {
    if (!missionPushClientRef.current || waypoints.length === 0) {
      console.error('Service not ready or no waypoints')
      return { success: false, error: 'Service not ready or no waypoints' }
    }

    const rosWaypoints = waypoints.map((wp, index) => ({
      frame: wp.frame || 3, // MAV_FRAME_GLOBAL
      command: wp.command || 16, // MAV_CMD_NAV_WAYPOINT
      is_current: index === 0,
      autocontinue: wp.autocontinue !== false,
      param1: wp.param1 || 0,
      param2: wp.param2 || 0,
      param3: wp.param3 || 0,
      param4: wp.param4 || 0,
      x_lat: parseFloat(wp.lat),
      y_long: parseFloat(wp.lng),
      z_alt: parseFloat(wp.alt),
    }))

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

  useEffect(() => {
    if (!rosRef.current) {
      rosRef.current = new ROSLIB.Ros({ url })

      // Initialize service client when connection is established
      const onConnection = () => {
        console.log('Connected to rosbridge_server.')
        setIsConnected(true)
        setError(null)
        setStatusData((prev) => ({ ...prev, status: 'Active' }))

        // Initialize mission push service
        missionPushClientRef.current = new ROSLIB.Service({
          ros: rosRef.current,
          name: '/mavros/mission/push', // Changed to standard MAVROS service name
          serviceType: 'mavros_msgs/WaypointPush',
        })

        // Setup topics
        const topics = [
          {
            name: '/mavros/vfr_hud',
            type: 'mavros_msgs/VFR_HUD',
            callback: (message) => {
              console.log(activewpRef.current)
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
              setTelemetryData((prev) => ({
                ...prev,
                gspeed: message.groundspeed,
                vspeed: message.climb,
                yaw: message.heading,
                disttowp: Math.round(distance / 1000),
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
              activewpRef.current = message.waypoints[message.current_seq]
            },
          },
          {
            name: '/mavros/mission/reached',
            type: 'mavros_msgs/WaypointReached',
            callback: (message) => {
              console.log(message)
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
  }
}

export default useRosConnection
