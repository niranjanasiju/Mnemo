import React from 'react';
import { Link } from 'react-router-dom';

function GameNavigation() {
  return (
    <div className="game-navigation">
      <h1>Game Menu</h1>
      <nav className="menu-bar">
        <ul>
          <li><Link to="/familiarfaces">Familiar Faces</Link></li>
          <li><Link to="/memorymatch">Memory Match</Link></li>
          <li><Link to="/storycompletion">Story Completion</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default GameNavigation;