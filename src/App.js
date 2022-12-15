import './App.css';
import Movie from './components/Movie';
import ReactJWPlayer from 'react-jw-player';

function App() {
    return (
        <div className="App">
            <Movie>
                <ReactJWPlayer
                    playerId='NjqDlXWT'
                    playerScript='https://cdn.jwplayer.com/libraries/NjqDlXWT.js'
                    file='https://cdn.jwplayer.com/videos/5XNxzP2U-MJjSqWn0.mp4'

                    //onAll={(event) => console.log(event)}
                />
            </Movie>
        </div>
    );
}

export default App;
