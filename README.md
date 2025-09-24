## Flight controller for CSN

A flight controller program to control drones using ardupilot. 

![Flight Controller Homepage](https://github.com/huzefazaheer/flight-controller/blob/main/imgs/homepage.png)

### Features

- Current location tracking
- Mav ros live status updates
- Control flight modes
- Built in waypoint system, allowing for multiple modes including patrolling
- A map layer based on Open Street Maps allowing for interactive positioning and wp control


### Modules

- Flight Information: Displays important updates like velocity, altitude and distance to wp
- Waypoint Manager: Control adding and removing of waypoints with an interactive map
- Action Window: Send control signal to ardupilot for functions such as taking off, landing, controlling mission e.t.c
- Logs Window: Displays mavros status messages for debugging faults


### Setup Instructions

1. Install Ardupilot and Mavros
https://github.com/Intelligent-Quads/iq_tutorials/blob/master/docs/Installing_Ardupilot_20_04.md

2. Install Gazebo
https://github.com/Intelligent-Quads/iq_tutorials/blob/master/docs/installing_gazebo_arduplugin.md

3. Install ROS and Catkin
https://github.com/Intelligent-Quads/iq_tutorials/blob/master/docs/installing_ros_20_04.md

#### Startup Commands for Gazebo Sim

```bash
roslaunch iq_sim runway.launch

cd ~/ardupilot/ArduCopter/ && sim_vehicle.py -v ArduCopter -f gazebo-iris --console

roslaunch iq_sim apm.launch

roslaunch rosbridge_server rosbridge_websocket.launch
```
