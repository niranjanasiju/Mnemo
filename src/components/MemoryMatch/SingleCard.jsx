import React from 'react'
import './SingleCard.css'

const SingleCard = ({ card, handleChoice, flipped , disabled }) => {
    const handleClick = () => {
        //console.log("Back of card clicked!");
        if (!disabled) {
            handleChoice(card); // This triggers the handleChoice function
        }
     
    };
  
    return (
      <div className="card">
        <div className={flipped ? "flipped" : ""}>
          <img className="front" src={card.src} alt="card-front" />
          <img
            className="back"
            src="/img/blueq.png"
            onClick={handleClick} // Correctly triggers handleChoice
            alt="card-back"
          />
        </div>
      </div>
    );
  };
  

export default SingleCard
