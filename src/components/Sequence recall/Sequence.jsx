/*import React, { useState, useEffect } from 'react';
import '../styles.css';

const App = () => {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [message, setMessage] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  // Buttons reference (you'll interact with this in React, not using DOM)
  const buttonColors = ['red', 'blue', 'green', 'yellow'];

  useEffect(() => {
    if (sequence.length > 0) {
      playSequence();
    }
  }, [sequence]);

  // Function to start a new game
  const startGame = () => {
    setMessage('');
    setPlayerSequence([]);
    setIsRestarting(false);
    setSequence(prevSeq => [...prevSeq, buttonColors[Math.floor(Math.random() * 4)]]);
    playSequence();
  };

  // Function to play the sequence (flash the buttons)
  const playSequence = async () => {
    setInProgress(true);
    for (let color of sequence) {
      if (isRestarting) break;
      // Using setTimeout for flashing the button (you can add an effect here)
      document.getElementById(color).classList.add('active');
      await new Promise(res => setTimeout(res, 600)); // Flash duration
      document.getElementById(color).classList.remove('active');
      await new Promise(res => setTimeout(res, 400)); // Pause duration
    }
    setInProgress(false);
  };

 
      const handleButtonClick = (color) => {
        if (inProgress) return;
      
        // Determine the current index being checked
        const currentIndex = playerSequence.length;
      
        // Check if the current input matches the sequence
        if (sequence[currentIndex] !== color) {
          setMessage('Game Over! Try Again!');
          setSequence([]);
          setLevel(1);
          setPlayerSequence([]);
          return;
        }
      
        // Update the player's sequence
        setPlayerSequence((prevSequence) => [...prevSequence, color]);
      
        // If the player completes the sequence correctly
        if (currentIndex + 1 === sequence.length) {
          setLevel((prevLevel) => prevLevel + 1);
          setPlayerSequence([]); // Reset player sequence for the next round
          setTimeout(() => startGame(), 1000); // Start next round after a delay
        }
      };
      

    // If the player completes the sequence correctly, move to the next level
    if (playerSequence.length + 1 === sequence.length) {
      setLevel(prevLevel => prevLevel + 1);
      setPlayerSequence([]);
      setTimeout(startGame, 1000); // Start next round
    }
  };

  // Handle start button click
  const handleStartClick = () => {
    setSequence([]);
    setLevel(1);
    setMessage('');
    startGame();
  };

  // Handle restart button click
  const handleRestartClick = () => {
    setIsRestarting(true);
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setMessage('Game Restarted!');
    setTimeout(() => {
      setIsRestarting(false);
      startGame();
    }, 0);
  };

  // JSX for the game buttons
  const renderButtons = () => {
    return buttonColors.map(color => (
      <div
        key={color}
        id={color}
        className={`button ${color}`}
        onClick={() => handleButtonClick(color)}
      />
    ));
  };

  return (
    <div className="main-container">
      <button className="quit-button" onClick={handleRestartClick}>Quit</button>
      <div className="container">
        <h1>Sequence Recall Game</h1>
        <div id="level">Level: {level}</div>
        <div id="game-board">
          {renderButtons()}
        </div>
        <button id="start-button" onClick={handleStartClick}>
          Start Game
        </button>
        <button id="restart-button" onClick={handleRestartClick}>
          Restart
        </button>
        <div id="message">{message}</div>
      </div>
    </div>
  );
};

export default App;
*/

import React, { useState, useEffect } from 'react';
import './Sequence.css';

const App = () => {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [message, setMessage] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [activeButton, setActiveButton] = useState(null); // State to track active button

  // Buttons reference (you'll interact with this in React, not using DOM)
  const buttonColors = ['red', 'blue', 'green', 'yellow'];

  useEffect(() => {
    if (sequence.length > 0) {
      playSequence();
    }
  }, [sequence]);

  // Function to start a new game
  const startGame = () => {
    setMessage('');
    setPlayerSequence([]);
    setIsRestarting(false);
    setSequence(prevSeq => [...prevSeq, buttonColors[Math.floor(Math.random() * 4)]]);
    playSequence();
  };

  // Function to play the sequence (flash the buttons)
  const playSequence = async () => {
    setInProgress(true);
    for (let color of sequence) {
      if (isRestarting) break;
      setActiveButton(color); // Update active button state
      await new Promise(res => setTimeout(res, 600)); // Flash duration
      setActiveButton(null); // Remove the active button
      await new Promise(res => setTimeout(res, 400)); // Pause duration
    }
    setInProgress(false);
  };

  const handleButtonClick = (color) => {
    if (inProgress) return;

    const currentIndex = playerSequence.length;

    // Check if the current input matches the sequence
    if (sequence[currentIndex] !== color) {
      setMessage('Game Over! Try Again!');
      setPlayerSequence([]); // Reset player sequence
      setLevel(1); // Reset level
      return;
    }

    // Update the player's sequence
    setPlayerSequence((prevSequence) => [...prevSequence, color]);
    setActiveButton(color);
    setTimeout(() => {
      setActiveButton(null); // Reset active button after animation
    }, 300); 
    // If the player completes the sequence correctly, move to the next round
    if (currentIndex + 1 === sequence.length) {
      setLevel((prevLevel) => prevLevel + 1);
      setPlayerSequence([]); // Reset player sequence for the next round
      setTimeout(() => startGame(), 1000); // Start next round after a delay
    }
  };

  // Handle start button click
  const handleStartClick = () => {
    setSequence([]);
    setLevel(1);
    setMessage('');
    startGame();
  };

  // Handle restart button click
  const handleRestartClick = () => {
    setIsRestarting(true);
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setMessage('Game Restarted!');
    setTimeout(() => {
      setIsRestarting(false);
      startGame();
    }, 0);
  };

  // JSX for the game buttons
  const renderButtons = () => {
    return buttonColors.map(color => (
      <div
        key={color}
        id={color}
        className={`button ${color} ${activeButton === color ? 'expand' : ''}`}
        onClick={() => handleButtonClick(color)}
      />
    ));
  };

  return (
    <div className="main-container">
      <button className="quit-button" onClick={handleRestartClick}>Quit</button>
      <div className="container">
        <h1>Sequence Recall Game</h1>
        <div id="level">Level: {level}</div>
        <div id="game-board">
          {renderButtons()}
        </div>
        <button id="start-button" onClick={handleStartClick}>
          Start Game
        </button>
        <button id="restart-button" onClick={handleRestartClick}>
          Restart
        </button>
        <div id="message">{message}</div>
      </div>
    </div>
  );
};

export default App;
