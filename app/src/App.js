import React, { useState, useEffect } from 'react';
import './App.css';

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
    },
    'Hot Cross Buns': {
      notes: ' A G B B B B A A A B B B B A A B A G',
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
      youtube: 'https://www.youtube.com/watch?v=YVpM2GsdQEQ'
    }
  },
  'Pro': {
  },
}

const renderNotesContent = (notes) => {
  if (notes.endsWith('.png')) {
    // If notes is a path to a PNG file, render an image
    return <img src={notes} alt="Sheet Music" style={{ maxWidth: '100%', height: 'auto' }} />;
  } else {
    // Otherwise, display notes as text
    return `Notes: ${notes}`; //STYLE THIS! return a <p> tag styled to have top margin
    //Want to have notes appear below the selection box?
  }
};

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
  }, [pressedKeys, audioNodes]);

  return (
    <div>
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
      {/* Notes and YouTube Embed Container */}
      <div className="notes-youtube-container">
        <div className="notes">
          {renderNotesContent(selectedSongDetails.notes)}
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
      </div>
      <div className="App" style={{ height: '25vh', position: 'absolute', bottom: 0, width: '100%', margin: 0, display: 'flex'}}>
        {Object.entries(keyBindings).map(([key, note]) => (
          <div
            key={note}
            style={{
              flexGrow: 1,
              height: '100%',
              alignSelf: 'flex-end',
              backgroundColor: pressedKeys[key] ? 'lightgreen' : note.includes('S') ? 'black' : 'white',
              color: note.includes('S') ? 'white' : 'black',
              border: '1px solid black',
              opacity: 1,
              userSelect: 'none'
            }}
          >
            {note.replace('S', '#')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
