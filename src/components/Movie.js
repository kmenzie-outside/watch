import React, { useState,useEffect } from 'react';
import ReactJWPlayer from 'react-jw-player';
import './Movie.css';
const webvtt=require('node-webvtt')

export default function Movie() {

const [Visible,setVisible] = useState(false)
const [cast, setCast] = useState([])
const [seconds,setSeconds] = useState(0)

useEffect(() => {

  //Get Video File
  fetch('https://cdn.jwplayer.com/v2/media/5XNxzP2U')
  .then(response => response.json())
  .then(json => {
    const trackInfo = json.playlist[0].tracks
    trackInfo.splice(trackInfo.length -1)

    //Loop through tracks in file
    trackInfo.map(data => {
      fetch(data.file)
      .then(res => res.text())
      .then(res => {
        const parsed=webvtt.parse(res)
        const cues = parsed.cues
        setCast((prevCastData) => {
          return[...prevCastData,[
            {name: data.label,cues:cues,id:1}
          ]]
             })

      })
      
    }) 

  })

},[])

const updateTime = (time) => {
  setSeconds(Math.round(time.currentTime))
}
// We'll use this funtion to see who should be on screen when


const updateCast = () => {

  console.log(seconds)
//   const second = Math.round(time.currentTime);
//   // Eventually, this "if" needs to look at a dynamic source or JSON file

 cast.map((data) => {
   const queueArray = data[0].cues
   console.log(queueArray)
   //queuArray.map((queueData) => {
    //console.log(queueData) 
    //if(10 > queueData.start) { console.log('yes!') }
   //})

 })


//   if(second === 5) {
//     setCast([
//       {name: "Bode Miller", id: 1}
//     ]
//     )
//   }
   setVisible(true)
} 

  return (
    <div className="reactVideo">

      <div className={Visible ? 'fadeIn' : 'fadeOut'}>
      <div className="cast">
       {cast.map((castInfo,index) => (
        <div className="castDetails" key={index}>
      <img src={"/assets/"+castInfo[0].name+".png"}
        alt="{castInfo.name}" 
        className="castImage" />
        <h2>{castInfo[0].name}</h2>
        </div>

       ))}
       
        </div>
      </div>

      <ReactJWPlayer
        playerId='NjqDlXWT'
        playerScript='https://cdn.jwplayer.com/libraries/NjqDlXWT.js'
        file='https://cdn.jwplayer.com/videos/5XNxzP2U-MJjSqWn0.mp4'

        //onAll={(event) => console.log(event)}
        onTime={(time) => updateTime(time)}
        isAutoPlay={true}
        onPause={() => updateCast()}
        onResume={() => setVisible(false)}
      />

      <button onClick={() => console.log(cast)}>Get Chapters</button>
    </div>
  )
}