"use client"

import { useEffect, useState } from "react";
import styles from "./navbar.module.css"

export default function Navbar(){

    const [weatherData, setWeatherData] = useState();

    const now = new Date();
    const time12hr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true // Force 12-hour format
    });

    const getData = useEffect(async (e) => {
        const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/islamabad?unitGroup=us&key=ZSH978YYTT645P7GB7LHBTQHT&contentType=json");
        const data = await response.json()
        setWeatherData(data)
    }, [])

    return(
        <nav className={styles.navbar}>
            <p className={styles.logo}>CSN</p>
            <div className={styles.status} ><img src="./status.svg" alt="" /><span className={styles.statustxt}>Status: Active</span></div>
            <div className={styles.right}>
                <p className={styles.weather}>{weatherData != undefined ? weatherData.currentConditions.conditions + ", " + ((weatherData.currentConditions.temp - 32) * (5/9)).toFixed(1) + " ºC" : ""}</p>
                <p className={styles.time}>{time12hr}</p>
            </div>
        </nav>
    );
}

// tolocaletimestring