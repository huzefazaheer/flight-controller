## Flight controller for CSN

A flight controller program to control drones using ardupilot. 

![Flight Controller Homepage](https://github.com/huzefazaheer/flight-controller/blob/main/imgs/homepage.png)

### Features

- Current location tracking
- Mav ros live status updates
- Control flight modes
- Built in waypoint system, allowing for multiple modes including patrolling
- A map layer based on Open Street Maps allowing for interacitve positioning and wp control


### Modules

- Flight Information: Displays important updates like velocit, altitude and distance to wp
- Waypoint Manager: Control adding and removing of waypoints with an interactive map
- Action Window: Send control signal to ardupilot for functions such as taking off, landing, controlling mission e.t.c
- Logs Window: Displays mavros status messages for debugging faults

#### Startup Commands for Gazebo Sim

To specify that a code block is Bash in Markdown, use **`bash`** after the backticks (\`\`\`) at the beginning of the code block. This is called a "language identifier" and it enables syntax highlighting for that specific language.

```bash
roslaunch iq_sim runway.launch

cd ~/ardupilot/ArduCopter/ && sim_vehicle.py -v ArduCopter -f gazebo-iris --console

roslaunch iq_sim apm.launch

roslaunch rosbridge_server rosbridge_websocket.launch
```
