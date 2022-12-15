import React, { useState } from 'react';
import ReactJWPlayer from 'react-jw-player';
import Axios from 'axios';
import './Movie.css';



function cast(time) {
  //console.log(time.currentTime)
  const second = Math.round(time.currentTime);
  // Eventually, this "if" needs to look at a dynamic source or JSON file
  if(second === 5) {

    //console.log('Bodie')
  }
} 

export default function Movie() {

  

const [track,setTrack] = useState('')
const [track2,setTrack2] = useState('')
const [Visible,setVisible] = useState(false)
const [castData, setCastData] = useState([])

const getChapters2 = () => {
  Axios.get('https://cdn.jwplayer.com/v2/media/5XNxzP2U').then(
    (response) => {
  setTrack2(response.data.playlist[0].tracks)
  
    }
  )
  //console.log(track2)
}


const getChapters = (cast) => {
    
  //First, grab all the data for the video
  Axios.get('https://cdn.jwplayer.com/v2/media/5XNxzP2U').then((response) => {
      
    // Then, put all the track data into a variable
    setTrack(response.data.playlist[0].tracks)

    // Step through all the tracks so we can turn them into an array
    track.map(data => {

      // Each track has a link to its chapter JSON info. This section breaks that down
      Axios.get(data.file).then((response) => {

          //Skip the extra file that has strips in it
          if(!data.file.includes("strips")) {

            const webvtt=require('node-webvtt')
        const parsed=webvtt.parse(response.data)
       

          // var cleanUp = data.label + '\n' + response.data
          //   .replace(/-->/g,'')
          //   .replace('WEBVTT','')
          //   .replaceAll(' ','\n')
          // const blerg = cleanUp.split('\n') //Splits at every line break and makes it an array
          
          // window.finalArray = blerg.filter((a) => a) //Cleans out blank values in the array
          
          // const cast = window.finalArray.shift(); //Separates the first item in the array and leaves the rest
 

    setCastData((prevCastData) => {
      return[...prevCastData,[[data.label],[parsed]]]
          //return[...prevCastData, cast]
         })

        
          }
    })
  }
      
      )

      

    }
    )
    console.log(castData)
  }
  //
  return (
    <div className="reactVideo">

      <div className={Visible?'fadeIn':'fadeOut'}>
        <h2>Cast</h2>
      </div>
      <ReactJWPlayer
    playerId='NjqDlXWT'
    playerScript='https://cdn.jwplayer.com/libraries/NjqDlXWT.js'
    file='https://cdn.jwplayer.com/videos/5XNxzP2U-MJjSqWn0.mp4'
    
    //onAll={(event) => console.log(event)}
    onTime={(time) => cast(time)}
    isAutoPlay={true}
    onPause={() => setVisible(true)}
    onResume={() => setVisible(false)}
onReady={(e) => console.log(e)}

  />
  <button onClick={getChapters}>Get Chapters</button>
    </div>
  )
}
