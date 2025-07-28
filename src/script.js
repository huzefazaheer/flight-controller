import { useState, useEffect, useRef, useCallback } from 'react'
import ROSLIB from 'roslib'

const initTel = {
  lat: 'N\\A',
  lng: 'N\\A',
  alt: 'N\\A',
  battery_percentage: 'N\\A',
  timestamp: 'N\\A',
  heading: 'N\\A',
  gspeed: 'N\\A',
  vspeed: 'N\\A',
  yaw: 'N\\A',
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
              setTelemetryData((prev) => ({
                ...prev,
                gspeed: message.groundspeed,
                vspeed: message.climb,
                yaw: message.heading,
              }))
            },
          },
          {
            name: '/mavros/global_position/global',
            type: 'sensor_msgs/NavSatFix',
            callback: (message) => {
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
  }
}

export default useRosConnection
