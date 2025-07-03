import styles from "./waypoint.module.css"

export default function WaypointManager(){
    return(
        <div className={styles.waypoint}>
            <h3>Current Waypoints</h3>
            <table>
                <tr>
                <th>ID</th>
                <th>Lat</th>
                <th>Long</th>
                <th>Alt</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>5.272838</td>
                    <td>6.3163127</td>
                    <td>100</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>5.233000</td>
                    <td>5.3103666</td>
                    <td>400</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>6.653321</td>
                    <td>7.3553167</td>
                    <td>129</td>
                </tr>
            </table>
            <button className={styles.btn}>Add New Waypoint</button>
        </div>
    )
}