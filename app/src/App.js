import React, { useState, useEffect } from 'react';
import './App.css';

const keyBindings = {
  'a': 'C',
  'w': 'C#',
  's': 'D',
  'e': 'D#',
  'd': 'E',
  'f': 'F',
  't': 'F#',
  'g': 'G',
  'y': 'G#',
  'h': 'A',
  'u': 'A#',
  'j': 'B',
  'k': 'C2',
  'o': 'C#2',
  'l': 'D2',
  'p': 'D#2', 
  ';': 'E2',
  "'": 'F2',
};

const App = () => {
  const [pressedKeys, setPressedKeys] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (keyBindings[key] && !pressedKeys.includes(key)) {
        setPressedKeys((currentKeys) => [...currentKeys, key]);
        // Play sound or trigger animation for keyBindings[key]
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (keyBindings[key]) {
        setPressedKeys((currentKeys) => currentKeys.filter((k) => k !== key));
        // Stop sound or animation for keyBindings[key]
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedKeys]);

  return (
    <div className="App" style={{ height: '50vh', position: 'absolute', bottom: 0, width: '100%', margin: 0, display: 'flex'}}>
      {Object.entries(keyBindings).map(([key, note]) => (
        <div
          key={note}
          style={{
            flexGrow: 1,
            height: '100%',
            backgroundColor: note.includes('#') ? 'black' : 'white',
            color: note.includes('#') ? 'white' : 'black',
            border: '1px solid black',
            opacity: pressedKeys.includes(key) ? 0.5 : 1,
          }}
        >
          {note}
        </div>
      ))}
    </div>
  );
};

export default App;
