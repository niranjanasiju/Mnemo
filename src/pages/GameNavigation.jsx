import React from 'react';
import { Link } from 'react-router-dom';

function GameNavigation() {
  const navigate = useNavigate();

  return (
    <div className="game-navigation">
      <h1>Game Menu</h1>
      <nav className="menu-bar">
        <ul>
          <li><Link to="/game4">Familiar Faces</Link></li>
          <li><Link to="/game1">Memory Match</Link></li>
          
        
      </nav>
    </div>
  );
}

export default GameNavigation;
