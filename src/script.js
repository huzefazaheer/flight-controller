import { useState, useEffect, useRef } from 'react';
import ROSLIB from 'roslib';

const initTel = {
        lat: "N\\A",
        lng:" N\\A",
        alt: "N\\A",
        battery_percentage: "N\\A",
        timestamp: "N\\A",
        heading_lat: "N\\A",
        heading_lng: "N\\A",
    }

const useRosConnection = (url = 'ws://localhost:9090') => {
    const [isConnected, setIsConnected] = useState(false);
    const [statusData, setStatusData] = useState({
        status: "Disconnected",
        bat: 0.00,
    })
    const [telemetryData, setTelemetryData] = useState(initTel);
    const [cameraFeed, setCameraFeed] = useState(null);
    const [error, setError] = useState(null);

    // Use useRef to hold the ROSLIB.Ros instance so it persists across renders
    // and doesn't trigger re-creation of the ROS object unnecessarily.
    const rosRef = useRef(null); 

    useEffect(() => {
        // Initialize ROS connection only once when the component mounts
        if (!rosRef.current) {
            rosRef.current = new ROSLIB.Ros({
                url: url
            });

            rosRef.current.on('connection', () => {
                console.log('Connected to rosbridge_server.');
                setIsConnected(true);
                setError(null); // Clear any previous errors

                // --- Subscribe to status topic ---
                const statusListener = new ROSLIB.Topic({
                    ros: rosRef.current,
                    name: '/sim/status',
                    messageType: 'std_msgs/Float64' // Matches your simulator's dummy type
                });

                statusListener.subscribe(function(message) {
                    // Update React state with incoming status data
                    setStatusData(message);
                });

                // --- Subscribe to telemetry topic ---
                const telemetryListener = new ROSLIB.Topic({
                    ros: rosRef.current,
                    name: '/sim/telemetry',
                    messageType: 'std_msgs/Float64' // Matches your simulator's dummy type
                });

                telemetryListener.subscribe(function(message) {
                    // Update React state with incoming telemetry data
                    setTelemetryData(message);
                });

                // --- Subscribe to camera feed topic ---
                const cameraListener = new ROSLIB.Topic({
                    ros: rosRef.current,
                    name: '/sim/camera_feed/compressed',
                    messageType: 'sensor_msgs/CompressedImage'
                });

                cameraListener.subscribe(function(message) {
                    // Update React state with incoming camera data (base64)
                    const imageData = "data:image/jpeg;base64," + message.data;
                    setCameraFeed(imageData);
                });
            });

            rosRef.current.on('error', (err) => {
                console.error('Error connecting to rosbridge_server:', err);
                setIsConnected(false);
                setError(err);
            });

            rosRef.current.on('close', () => {
                console.log('Disconnected from rosbridge_server.');
                setIsConnected(false);
                setTelemetryData(initTel); // Clear data on disconnect
                setCameraFeed(null);
                setStatusData({
                    status: "Disconnected",
                    bat: 0.00,
                })
                console.log(telemetryData)
                // You might add reconnection logic here if desired
            });
        }

        // Cleanup function: Close ROS connection when component unmounts
        return () => {
            if (rosRef.current && rosRef.current.isConnected) {
                console.log('Closing ROS connection on unmount.');
                rosRef.current.close();
            }
        };
    }, [url]); // Re-run effect if URL changes (though usually fixed for rosbridge)

    return { isConnected, statusData, telemetryData, cameraFeed, error, ros: rosRef.current };
};

export default useRosConnection;