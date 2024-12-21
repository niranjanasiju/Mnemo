import React from 'react';
import { Link } from 'react-router-dom';

function GameNavigation() {
  return (
    <div className="game-navigation">
      <h1>Game Menu</h1>
      <nav className="menu-bar">
        <ul>
          <li><Link to="/game4">Familiar Faces</Link></li>
          <li><Link to="/game1">Memory Match</Link></li>
          
        </ul>
      </nav>
    </div>
  );
}

export default GameNavigation;