import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import YouTube, { YouTubePlayer } from "react-youtube";

const keyBindings = {
  'a': 'C',
  'w': 'CS',
  's': 'D',
  'e': 'DS',
  'd': 'E',
  'f': 'F',
  't': 'FS',
  'g': 'G',
  'y': 'GS',
  'h': 'A',
  'u': 'AS',
  'j': 'B',
  'k': 'C2',
  'o': 'CS2',
  'l': 'D2',
  'p': 'DS2',
  ';': 'E2',
  "'": 'F2',
};

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const modes = ['Easy', 'Intermediate', 'Pro'];

const songs = {
  'Easy': {
    'Mary Had a Little Lamb': {
      notes: 'E D C D E E E D D D E G G E D C D E E E E D D E D C',
      youtube: 'uYgp3lAfolo',
      description: 'Mary Had a Little Lamb is an American nursery rhyme of nineteenth-century. This song is the first instance of English verse recorded on Thomas Edison’s phonograph. This simple verse is perfect for getting started with playing the piano.',
    },
    'Hot Cross Buns': {
      notes: ' E D C E D C C C C C D D D D E D C',
      youtube: 'https://www.youtube.com/watch?v=fM2xseupKlY',
      description: 'Hot Cross Buns is an English nursery rhyme. It refers to the spiced English confection known as a hot cross bun, associated with the end of Lent and eaten on Good Friday in various countries. There are multiple versions of the songs, and this is an arranged version popular on kids channels.',
    },
    'Row, Row, Row Your Boat': {
      notes: 'C C C D E E D E F G C C C G G G E E E C C C G F E D C',
      youtube: 'https://www.youtube.com/watch?v=Z1U8SBkAbLQ',
      description: 'Row, Row, Row Your Boat is an American nursery rhyme, often sung in a round for up to four voice parts soprano, alto, tenor, and bass. This version uses both hands to play the upper C note with your right hand.',
    },
    'Go Tell Aunt Rhody': {
      notes: 'E E D C C D D F E D C G G F E E E D C D E C',
      youtube: 'https://www.youtube.com/watch?v=iYwcE5QEUG4',
      description: 'Go Tell Aunt Rhody is an American folk song of nineteenth-century. The song talks about the grief of loss. This song uses a wide range for an easy song.',
    },
    'A-Tisket, A-Tasket' :{
      notes: 'G G E F G E F G G E F G E E F F D D F F D D G F E D E C',
      youtube: 'https://www.youtube.com/watch?v=kI9-BJdP6cE',
      description: 'A-Tisket, A-Tasket is an American nursery rhyme of nineteenth-century. Traditionally it was sung while children danced in a circle. Ella Fitzgerald later made this song into a jazz piece.',
    },
    'Jingle Bells' :{
      notes: 'E E E E E E E G C D E F F F F F E E E E E D D E D G E E E E E E E G C D E F F F F F E E E E G G F D C',
      youtube: 'https://www.youtube.com/watch?v=ROqgdTRa0bE',
      description: 'Jingle Bells was written in 1850 by James Lord Pierpont, originally titled "The One Horse Open Sleigh". It became associated with winter and Christmas in the 1860s and 1870s. The first and the second verses are almost identical with a slight change in the end.'
    },
  },
  'Intermediate': {
    'Für Elise': {
      notes: 'furelise.png',
      youtube: 'https://www.youtube.com/watch?v=YVpM2GsdQEQ',
      description: 'Für Elise is a commonly known name for Bagatelle No. 25 in A minor for solo piano, composed by Ludwig van Beethoven. It was discovered 40 years after his death, and the identity of "Elise" is unknown. This is an easy version, but you can speed up to make it more challenging.',
    },
    'Mia & Sebastian\'s Theme': {
      notes: 'lalaland.png',
      youtube: 'https://www.youtube.com/watch?v=8AlRmdnVPyY',
      description: 'This song is from the musical romantic drama film La La Land. It is a recurring theme song of two main characters, written in A major. The first part is a sentimental verse suitable for beginner to intermediate players, but the second part abruptly changes the atmosphere and speed, making it challenging for intermediate players.',
    },
    'Prelude in E Minor, Op. 28, No. 4': {
      notes: 'preludeine.png',
      youtube: 'https://www.youtube.com/watch?v=CU9RgI9j7Do',
      description: 'The Prelude Op. 28, No. 4 by Frédéric Chopin is one of the 24 Chopin preludes. By Chopin\'s request, this was played at his own funeral. It focuses on chords on the left hand and minimal use of the right hand makes this piece sentimental and solemn.',
    },
  },
  'Pro': {
    'MPrelude in C Major, Op. 28, No. 1': {
      notes: 'preludeinc.png',
      youtube: 'https://www.youtube.com/watch?v=2DDUCCxsSQI',
      description: 'The Prelude Op. 28, No. 1 is one of Chopin\'s first preludes. This is a short piece that lasts about 40 seconds to one minute and consists of 8-bar phrases with a coda at the end of the piece and also consists of arpeggios in a four-part harmony.',
    },
  }
}

const renderNotesContent = (notes) => {
  if (notes.endsWith('.png')) {
    // If notes is a path to a PNG file, render an image
    return <img id="sheet-music-img" src={notes} alt="Sheet Music" style={{ maxWidth: '100%', height: 'auto', paddingRight: '0' }} />;
  } else {
    // Otherwise, display notes as text
    return (
      <div>
        <h2 id="notes-header">Notes</h2>
        <p id="little-notes" style={{ marginTop: '10px', fontSize: '40px' }}>{notes}</p>
      </div>
    );
  }
};

const renderDescriptionContent = (description) => {
  return <p id="description">{description}</p>
}
let videoElement: YouTubePlayer = null;

const App = () => {
  const [pressedKeys, setPressedKeys] = useState({});
  const [audioNodes, setAudioNodes] = useState({});
  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [selectedSong, setSelectedSong] = useState(Object.keys(songs[modes[0]])[0]);
  const [isPaused, setIsPaused] = useState(false);
  const selectedSongDetails = songs[selectedMode][selectedSong];

  const handleModeChange = (event) => {
    setSelectedMode(event.target.value);
    setSelectedSong(Object.keys(songs[event.target.value])[0]);
  };

  const handleSongChange = (event) => {
    setSelectedSong(event.target.value);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const _onReady = (event: YouTubePlayer) => {
    videoElement = event;
  };

  useEffect(() => {
    if (videoElement) {
      // get current time
      const elapsed_seconds = videoElement.target.getCurrentTime();

      // calculations
      const elapsed_milliseconds = Math.floor(elapsed_seconds * 1000);
      const ms = elapsed_milliseconds % 1000;
      const min = Math.floor(elapsed_milliseconds / 60000);
      const seconds = Math.floor((elapsed_milliseconds - min * 60000) / 1000);

      const formattedCurrentTime =
        min.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0") +
        ":" +
        ms.toString().padStart(3, "0");

      console.log(formattedCurrentTime);

      // Pause and Play video
      if (isPaused) {
        videoElement.target.pauseVideo();
      } else {
        videoElement.target.playVideo();
      }
    }
  }, [isPaused, videoElement]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (videoElement && videoElement.target.getCurrentTime() > 0) {
        const elapsed_seconds = videoElement.target.getCurrentTime();

        // calculations
        const elapsed_milliseconds = Math.floor(elapsed_seconds * 1000);
        const ms = elapsed_milliseconds % 1000;
        const min = Math.floor(elapsed_milliseconds / 60000);
        const seconds = Math.floor((elapsed_milliseconds - min * 60000) / 1000);

        const formattedCurrentTime =
          min.toString().padStart(2, "0") +
          ":" +
          seconds.toString().padStart(2, "0") +
          ":" +
          ms.toString().padStart(3, "0");

        console.log(formattedCurrentTime);

        // verify video status
        if (videoElement.target.playerInfo.playerState === 1) {
          console.log("the video is running");
        } else if (videoElement.target.playerInfo.playerState === 2) {
          console.log("the video is paused");
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const playNote = (note) => {
    const audioSource = audioContext.createBufferSource();
    fetch(`sounds/${note}.mp3`)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        audioSource.buffer = audioBuffer;
        audioSource.connect(audioContext.destination);
        audioSource.start(0);
        setAudioNodes((prevNodes) => ({ ...prevNodes, [note]: audioSource }));
      });
  };

  const stopNote = (note) => {
    if (audioNodes[note]) {
      audioNodes[note].stop();
      setAudioNodes((prevNodes) => {
        const newNodes = { ...prevNodes };
        delete newNodes[note];
        return newNodes;
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (keyBindings[key] && !pressedKeys[key]) {
        setPressedKeys((currentKeys) => ({ ...currentKeys, [key]: true }));
        playNote(keyBindings[key]);
      } else if (key === " ") {
        e.preventDefault(); // Prevent default behavior of space key (e.g., scrolling)
        togglePause();
      } else if (key === "arrowleft") {
        videoElement.target.seekTo(videoElement.target.getCurrentTime() - 5, true);
      } else if (key === "arrowright") {
        videoElement.target.seekTo(videoElement.target.getCurrentTime() + 5, true);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (keyBindings[key]) {
        setPressedKeys((currentKeys) => {
          const newKeys = { ...currentKeys };
          delete newKeys[key];
          return newKeys;
        });
        stopNote(keyBindings[key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  const setDisplayKeyboardLetters = (isChecked) => {
    if (isChecked) {
      let keyboardLetters = document.querySelectorAll('.keyboard-letters');
      keyboardLetters.forEach(p => {
        p.style.display = 'block';
      });
    } else {
      let keyboardLetters = document.querySelectorAll('.keyboard-letters');
      keyboardLetters.forEach(p => {
        p.style.display = 'none';
      });
    }
  };

  const setDisplayPianoNotes = (isChecked) => {
    
      let pianoNotes = document.querySelectorAll('.pianoNotes');

      pianoNotes.forEach(p => {
        p.style.visibility = isChecked ? 'visible' : 'hidden';
      });
  };

  return (
    <div id="body">
      <header class="header">
        <div class="logo">
            <img id="logo-img" src="pianoLogo.jpg" alt="Piano Logo" />
        </div>
        
        <Link to="/">
            <button id="home-button">Home</button>
          </Link>
        <div className="dropdown-container">
          
          <select 
            className="dropdown"
            value={selectedMode} 
            onChange={handleModeChange}
          >
            {modes.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
          <select 
            className="dropdown"
            value={selectedSong} 
            onChange={handleSongChange}
          >
            {Object.keys(songs[selectedMode]).map((songName) => (
              <option key={songName} value={songName}>{songName}</option>
            ))}
          </select>
        </div>
        <>

          <label className="container"><pre>  Display Keyboard Letters</pre>
            <input class="checkbox-1" type="checkbox" defaultChecked onChange={(event) => setDisplayKeyboardLetters(event.target.checked)}/>
            <span className="checkmark"></span>
          </label>

          <label className="container"><pre>  Display Piano Notes</pre>
            <input class="checkbox-2" type="checkbox" defaultChecked onChange={(event) => setDisplayPianoNotes(event.target.checked)}/>
            <span className="checkmark"></span>
          </label>


        </>
        <a href="https://github.com/628005910/thepianoguys" class="image-link">
            <img id="GitHub-logo" src="github-mark.png" alt="GitHub logo image" />
          </a>

    </header>
      {/* Notes and YouTube Embed Container */}
      <div className="notes-youtube-container">
        <div className="notes">
          <div className='notes-text'>
            {renderNotesContent(selectedSongDetails.notes)}
          </div>
        </div>
        <div className="youtube-embed">
          <YouTube videoId={selectedSongDetails.youtube} onReady={_onReady}/>
        </div>
        <div className="description">
          <h2 id="description-header">Description</h2>
          {renderDescriptionContent(selectedSongDetails.description)}
        </div>
      </div>


      <div className="App" style={{ height: '22vh', position: 'absolute', bottom: 0, left: '20%', width: '60%', margin: 0, display: 'flex', justifyContent: 'center' }}>
        {Object.entries(keyBindings).map(([key, note]) => {
          let bottom = 0;
          let left = '0%';
          let width = '9%'; // Width of white keys
          let height = '100%'; // Height of white keys

          switch (note) {
            case 'CS':
              left = '6.5%';
              width = '5%'; // Width of black keys
              height = '70%'; // Adjust the top of black keys
              bottom = '30%'; // Adjust the top of black keys
              break;
            case 'DS':
              left = '15.6%';
              width = '5%';
              height = '70%'; // Adjust the top of black keys
              bottom = '30%';
              break;
            case 'FS':
              left = '33.7%';
              width = '5%';
              height = '70%'; // Adjust the top of black keys
              bottom = '30%';
              break;
            case 'GS':
              left = '42.9%';
              width = '5%';
              height = '70%'; // Adjust the top of black keys
              bottom = '30%';
              break;
            case 'AS':
              left = '51.9%';
              width = '5%';
              height = '70%'; // Adjust the top of black keys
              bottom = '30%';
              break;
            case 'CS2':
              left = '70.1%';
              width = '5%';
              height = '70%'; // Adjust the top of black keys
              bottom = '30%';
              break;
            case 'DS2':
              left = '79.3%';
              width = '5%';
              height = '70%'; // Adjust the top of black keys
              bottom = '30%';
              break;
          }
          
          if (note.includes('S')) {
            return (
              <div
                key={note}
                style={{
                  position: 'absolute',
                  bottom,
                  left,
                  width,
                  height,
                  backgroundColor: pressedKeys[key] ? '#07a038' : 'black',
                  color: 'white',
                  border: '1px solid black',
                  borderRadius: '5px',
                  opacity: 1,
                  userSelect: 'none'
                }}
              >
                <p className="pianoNotes">{note.replace('S', '#')}</p>
              </div>
            );
          } else {
            return (
              <div
                key={note}
                style={{
                  flexGrow: 1,
                  width,
                  height: '100%',
                  alignSelf: 'flex-end',
                  backgroundColor: pressedKeys[key] ? '#1cc852' : 'white',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '5px',
                  opacity: 1,
                  userSelect: 'none'
                }}
              >
                <p className="pianoNotes">{note}</p>
              </div>
            );
          }
        })}
      </div>
      
      <p class="keyboard-letters" style={{ position: 'absolute', bottom: '0px', left: '22.6%' }}>a</p>
      <p class="keyboard-letters" style={{ color: 'white', position: 'absolute', bottom: '6%', left: '25.1%' }}>w</p>
      <p class="keyboard-letters" style={{ position: 'absolute', bottom: '0px', left: '28.0%' }}>s</p>
      <p class="keyboard-letters" style={{ color: 'white', position: 'absolute', bottom: '6%', left: '30.7%' }}>e</p>
      <p class="keyboard-letters" style={{ position: 'absolute', bottom: '0px', left: '33.3%' }}>d</p>
      <p class="keyboard-letters" style={{ position: 'absolute', bottom: '0px', left: '39.0%' }}>f</p>
      <p class="keyboard-letters" style={{ color: 'white', position: 'absolute', bottom: '6%', left: '41.7%' }}>t</p>
      <p class="keyboard-letters" style={{ position: 'absolute', bottom: '0px', left: '44.3%' }}>g</p>
      <p class="keyboard-letters" style={{ color: 'white', position: 'absolute', bottom: '6%', left: '47.1%' }}>y</p>
      <p class="keyboard-letters" style={{ position: 'absolute', bottom: '0px', left: '49.8%' }}>h</p>
      <p class="keyboard-letters" style={{ color: 'white', position: 'absolute', bottom: '6%', left: '52.5%' }}>u</p>
      <p class="keyboard-letters" style={{ position: 'absolute', bottom: '0px', left: '55.4%' }}>j</p>
      <p class="keyboard-letters" style={{ position: 'absolute', bottom: '0px', left: '60.8%' }}>k</p>
      <p class="keyboard-letters" style={{ color: 'white', position: 'absolute', bottom: '6%', left: '63.3%' }}>o</p>
      <p class="keyboard-letters" style={{ position: 'absolute', bottom: '0px', left: '66.2%' }}>l</p>
      <p class="keyboard-letters" style={{ color: 'white', position: 'absolute', bottom: '6%', left: '68.8%' }}>p</p>
      <p class="keyboard-letters" style={{ position: 'absolute', bottom: '0px', left: '71.7%' }}>;</p>
      <p class="keyboard-letters" style={{ position: 'absolute', bottom: '0px', left: '77.3%' }}>'</p>

    </div>
  );
};



export default App;
