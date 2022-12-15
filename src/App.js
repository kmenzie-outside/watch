import './App.css';
import Movie from './components/Movie';

function App() {
    return (
        <div className="App">
            <Movie
                playerId='NjqDlXWT'
                playerScript='https://cdn.jwplayer.com/libraries/NjqDlXWT.js'
                file='https://cdn.jwplayer.com/videos/5XNxzP2U-MJjSqWn0.mp4'
                isAutoPlay={true}
            />
        </div>
    );
}

export default App;
