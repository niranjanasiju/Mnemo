import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function GameNavigation() {
  const navigate = useNavigate();

  return (
    <div className="game-navigation">
      <h1>Game Menu</h1>
      <nav className="menu-bar">
        <ul>
          <li>
            <Link to="/memorymatch">Memory Match</Link>
          </li>
          <li>
            <Link to="/familiarfaces">Familiar Faces</Link>
          </li>
          
        </ul>
      </nav>
    </div>
  );
}

export default GameNavigation;
