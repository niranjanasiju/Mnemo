import React from 'react';
import { Link } from 'react-router-dom';
import './GameNavigation.css'; // Import the CSS file

function GameNavigation() {
  return (
    <div className="game-navigation">
      <h1>Game Menu</h1>
      <nav>
        <Link to="/familiarfaces">
          <button>Familiar Faces</button>
        </Link>
        <Link to="/MemoryMatch">
          <button>Memory Match</button>
        </Link>
      </nav>
    </div>
  );
}

export default GameNavigation;
