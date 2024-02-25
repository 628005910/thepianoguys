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
      notes: 'A A A',
      youtube: 'https://www.youtube.com/watch?v=uYgp3lAfolo',
    },
    'Hot Cross Buns': {
      notes: 'AAA',
      youtube: 'https://www.youtube.com/watch?v=fM2xseupKlY',
    },
    'Row, Row, Row Your Boat': {
      notes: 'AAA',
      youtube: 'https://www.youtube.com/watch?v=Z1U8SBkAbLQ',
    },
    'Go Tell Aunt Rhody': {
      notes: 'AAA',
      youtube: 'https://www.youtube.com/watch?v=iYwcE5QEUG4',
    },
  },
  'Intermediate': {
  },
  'Pro': {
  },
}

const App = () => {
  const [pressedKeys, setPressedKeys] = useState({});
  const [audioNodes, setAudioNodes] = useState({});
  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [selectedSong, setSelectedSong] = useState(Object.keys(songs[modes[0]])[0]);

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
    <div className="App" style={{ height: '50vh', position: 'absolute', bottom: 0, width: '100%', margin: 0, display: 'flex'}}>
      {Object.entries(keyBindings).map(([key, note]) => (
        <div
          key={note}
          style={{
            flexGrow: 1,
            height: '100%',
            backgroundColor: note.includes('S') ? 'black' : 'white',
            color: note.includes('S') ? 'white' : 'black',
            border: '1px solid black',
            opacity: pressedKeys[key] ? 0.5 : 1,
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
