import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactJWPlayer from 'react-jw-player';
import './Movie.css';
const webvtt = require('node-webvtt');

export default function Movie(props) {

    const [Visible, setVisible] = useState(false);
    const [cast, setCast] = useState([]);
    const [activeCast, setActiveCast] = useState([]);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const getCast = async () => {
            //Get Video File
            const response = await fetch('https://cdn.jwplayer.com/v2/media/5XNxzP2U');
            const json = await response.json();
            const trackInfo = json.playlist[0].tracks;
            trackInfo.splice(trackInfo.length - 1);

            //Loop through tracks in file
            const castList = await Promise.all(
                trackInfo.map(async (data) => {
                    const res = await fetch(data.file);
                    const parsed = webvtt.parse(await res.text());
                    return { name: data.label, cues: parsed.cues };
                })
            );
            setCast(castList);
            setActiveCast(castList);
        };
        getCast().catch(console.error);
    }, []);

    const updateTime = (time) => {
        setSeconds(Math.round(time.currentTime));
        updateCast(seconds);
    };

    const updateCast = useCallback((secondsIn) => {
        const active = cast.filter((actor) => {
            for (let i = 0; i < actor.cues.length; i++) {
                if (actor.cues[i].start > secondsIn) {
                    return false;
                }
                else if (actor.cues[i].start <= secondsIn && actor.cues[i].end >= secondsIn) {
                    return true;
                }
            }
            return false;
        });
        setActiveCast(active);
    },
        [seconds]
    );

    return (
        <div className="reactVideo">

            <div className={Visible ? 'fadeIn' : 'fadeOut'}>
                <CastDisplay cast={activeCast}></CastDisplay>
            </div>
            <ReactJWPlayer
                playerId={props.playerId}
                playerScript={props.playerScript}
                file={props.file}
                isAutoPlay={props.isAutoPlay}


                //onAll={(event) => console.log(event)}
                onTime={(time) => updateTime(time)}
                onPause={() => setVisible(true)}
                onResume={() => setVisible(false)}
            />

            <button onClick={() => console.log(cast)}>Get Chapters</button>
        </div>
    );
}

function CastDisplay(props) {
    if (props.cast?.length > 0) {
        return (
            <div className="cast">
                {props.cast.map((castInfo, index) => (
                    <div className="castDetails" key={index}>
                        <img src={"/assets/" + castInfo.name + ".png"}
                            alt="{castInfo.name}"
                            className="castImage" />
                        <h2>{castInfo.name}</h2>
                    </div>

                ))}

            </div>);
        }
    return null;

}