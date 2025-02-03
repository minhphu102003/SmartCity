import React, {useEffect,useState} from "react";
import Axios from "axios";


const Weather = ({address = null}) => {
    const [market,setMarket] = useState({
        latitude: 16.0482016,
        longitude: 108.1679869
    });

    useEffect(()=>{
        
    },[address]);

    return (
        <div>Weather</div>
    );
}

export default Weather;