import React from 'react';
import { Link } from 'react-router-dom';
import './GameNavigation.css'

function GameNavigation() {
  return (
    <div className="game-navigation">
      <h1>Game Menu</h1>
      <nav >
        
          <Link to="/game4"><button >Familiar Faces</button></Link>
           <Link to="/game1"><button>Memory Match</button></Link>
          
        
      </nav>
    </div>
  );
}

export default GameNavigation;