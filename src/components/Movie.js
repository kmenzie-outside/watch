import React, { useState, useEffect } from 'react';
import ReactJWPlayer from 'react-jw-player';
import './Movie.css';
const webvtt = require('node-webvtt');

export default function Movie(props) {

    const [Visible, setVisible] = useState(false);
    const [cast, setCast] = useState([]);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {

        //Get Video File
        const response = await fetch('https://cdn.jwplayer.com/v2/media/5XNxzP2U');
        const json = await response.json();
        const trackInfo = json.playlist[0].tracks;
        trackInfo.splice(trackInfo.length - 1);

        //Loop through tracks in file
        const curCast = trackInfo.map(data => {
            const res = await fetch(data.file);
            const parsed = webvtt.parse(await res.text());
            return { name: data.label, cues: parsed.cues };

        });
        setCast(curCast);

    }, []);

    const updateTime = (time) => {
        setSeconds(Math.round(time.currentTime));
    };
    // We'll use this funtion to see who should be on screen when


    const updateCast = () => {

        console.log(seconds);
        //   const second = Math.round(time.currentTime);
        //   // Eventually, this "if" needs to look at a dynamic source or JSON file

        cast.map((data) => {
            const queueArray = data[0].cues;
            console.log(queueArray);
            //queuArray.map((queueData) => {
            //console.log(queueData) 
            //if(10 > queueData.start) { console.log('yes!') }
            //})

        });


        //   if(second === 5) {
        //     setCast([
        //       {name: "Bode Miller", id: 1}
        //     ]
        //     )
        //   }
        setVisible(true);
    };

    const jwPlayer = React.Children.only(this.props.Children);
    jwPlayer.onTime = (time) => updateTime(time);
    jwPlayer.isAutoPlay = true;
    jwPlayer.onPause = updateCast;
    jwPlayer.onResume = () => setVisible(false);

    return (
        <div className="reactVideo">

            <div className={Visible ? 'fadeIn' : 'fadeOut'}>
                <CastDisplay cast={cast}></CastDisplay>
            </div>

            {jwPlayer}

            <button onClick={() => console.log(cast)}>Get Chapters</button>
        </div>
    );
}

function CastDisplay(props) {
    return (
        <div className="cast">
            {props.cast.map((castInfo, index) => (
                <div className="castDetails" key={index}>
                    <img src={"/assets/" + castInfo[0].name + ".png"}
                        alt="{castInfo.name}"
                        className="castImage" />
                    <h2>{castInfo[0].name}</h2>
                </div>

            ))}

        </div>
    );
}
