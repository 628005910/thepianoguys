import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

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
      youtube: 'https://www.youtube.com/watch?v=uYgp3lAfolo',
      description: 'This song helps develop basic rhytm.'
    },
    'Hot Cross Buns': {
      notes: ' E D C E D C C C C C D D D D E D C',
      youtube: 'https://www.youtube.com/watch?v=fM2xseupKlY',
    },
    'Row, Row, Row Your Boat': {
      notes: 'C C C D E E D E F G G F E D C C D E E D E F G G F E D C',
      youtube: 'https://www.youtube.com/watch?v=Z1U8SBkAbLQ',
    },
    'Go Tell Aunt Rhody': {
      notes: 'E D C D E E E D D E D C C E E E E D D E D C',
      youtube: 'https://www.youtube.com/watch?v=iYwcE5QEUG4',
    },
    'A-Tisket, A-Tasket' :{
      notes: 'C C G G A A G F F E E D D C G G F F E E D G G F F E E D C',
      youtube: 'https://www.youtube.com/watch?v=kI9-BJdP6cE',
    },
    'Jingle Bells' :{
      notes: 'E E E E E E E E G C D E F F F F F E E E E D D E D G E E E E E D D E D C',
      youtube: 'https://www.youtube.com/watch?v=ROqgdTRa0bE',
    },
  },
  'Intermediate': {
    'Für Elise': {
      notes: 'furelise.png',
      youtube: 'https://www.youtube.com/watch?v=YVpM2GsdQEQ',
      description: 'This song helps develop skills.'
    }
  },
  'Pro': {
  },
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
        <p id="little-notes" style={{ marginTop: '10px', fontSize: '50px' }}>{notes}</p>
      </div>
    );
  }
};

const renderDescriptionContent = (description) => {
  return <p id="description">{description}</p>
}

const App = () => {
  const [pressedKeys, setPressedKeys] = useState({});
  const [audioNodes, setAudioNodes] = useState({});
  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [selectedSong, setSelectedSong] = useState(Object.keys(songs[modes[0]])[0]);
  const selectedSongDetails = songs[selectedMode][selectedSong];

  const handleModeChange = (event) => {
    setSelectedMode(event.target.value);
    setSelectedSong(Object.keys(songs[event.target.value])[0]);
  };

  const handleSongChange = (event) => {
    setSelectedSong(event.target.value);
  };
  
  const playNote = (note) => {
    const audioSource = audioContext.createBufferSource();
    fetch(`sounds/${note}.mp3`)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        console.log("xdsedsadsadas");
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

  const setNaturalNotes = (isChecked) => {
    if (isChecked) {
      let pianoNotes = document.querySelectorAll('.sharps-and-flats');
      pianoNotes.forEach(p => {
        p.style.display = 'block';
      });
    } else {
      let pianoNotes = document.querySelectorAll('.sharps-and-flats');
      pianoNotes.forEach(p => {
        p.style.display = 'none';
      });
    }
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

          <label className="container"><pre>  Display Sharps and Flats</pre>
            <input class="checkbox-3" type="checkbox" defaultChecked onChange={(event) => setNaturalNotes(event.target.checked)}/>
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
          <iframe
            className="youtube-iframe"
            src={`https://www.youtube.com/embed/${new URL(selectedSongDetails.youtube).searchParams.get('v')}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="skills-description">
          <h2 id="skills-header">Description</h2>
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
