import React, { useState, useEffect, useCallback } from 'react';
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
        };
        getCast().catch(console.error);
    }, []);

    const updateCast = useCallback((secondsIn) => {
        const active = cast.filter((actor) => {
            for (let i = 0; i < actor.cues.length; i++) {
                if (actor.cues[i].start > secondsIn) {
                    return false;
                }
                else if (actor.cues[i].text === "In" && actor.cues[i].start <= secondsIn && actor.cues[i].end >= secondsIn) {
                    return true;
                }
            }
            return false;
        });
        setActiveCast(active);
    },
        [cast]
    );

    const updateTime = (time) => {
        setSeconds(Math.round(time.currentTime));
        updateCast(seconds);
    };

    return (
        <div className="reactVideo">


            <ReactJWPlayer
                playerId={props.playerId}
                playerScript={props.playerScript}
                file={props.file}
                isAutoPlay={props.isAutoPlay}

                onTime={(time) => updateTime(time)}
                onPause={() => setVisible(true)}
                onResume={() => setVisible(false)}
            />
            <CastDisplay cast={activeCast} visible={Visible} />
        </div>
    );
}

function CastDisplay(props) {
    const [animationActive, setAnimationActive] = useState(false);
    const [focusedActor, setFocusedActor] = useState(null);
    useEffect(() => {
        if (!props.visible) {
            setFocusedActor(null);
        }
    },[props.visible]);


    const focusActor = (toFocus) => {
        if (toFocus === focusedActor) {
            setFocusedActor(null);
        }
        else {
            setFocusedActor(toFocus);
        }
    };

    return (
        <div className={'castContainer ' + (props.visible ? 'fadeIn' : 'fadeOut')}
            onAnimationEnd={() => setAnimationActive(false)}
            onAnimationStart={() => setAnimationActive(true)}>
            {((props.visible || animationActive) && props.cast?.length > 0) ?
                <>
                    <FocusedPerson focused={focusedActor} onClear={() => setFocusedActor(null)} />
                    <div className="cast displayBox">
                        {props.cast.map((castInfo, index) => (
                            <CastMemberTile castInfo={castInfo} key={index} focusActor={focusActor} />
                        ))}
                    </div>
                </>
                : null}
        </div>
    );
}

function FocusedPerson(props) {
    if (props.focused) {
        return (
            <article className="displayBox">
                <img src="/assets/closeIcon.png" onClick={props.onClear} alt="close" className="closeButton"/>
                <img src={"/assets/" + props.focused.name + ".png"}
                    alt="{props.focused.name}"
                    className="castImage" />
                <h1>{props.focused.name}</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
            </article>
        );
    }
    return null;
}

function CastMemberTile(props) {

    return (
        <div className="castDetails"
            onClick={() => props.focusActor(props.castInfo)}>
            <img src={"/assets/" + props.castInfo.name + ".png"}
                alt="{props.castInfo.name}"
                className="castImage" />
            <h2>{props.castInfo.name}</h2>
        </div>);
}