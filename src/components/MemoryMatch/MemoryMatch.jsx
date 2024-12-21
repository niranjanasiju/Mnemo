
import { useEffect, useState } from 'react'
import './MemoryMatch.css'
import SingleCard from './SingleCard'

const cardImages = [
  { "src": "/img/giraffe.png", matched : false  },
  { "src": "/img/hippo.png", matched : false },
  { "src": "/img/owl.png" , matched : false},
  { "src": "/img/rhino.png" , matched : false},
  { "src": "/img/sheep.png" , matched : false},
  { "src": "/img/zebra.png" , matched : false},
]

function MemoryMatch() {

  const[cards,setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled , setDisabled] = useState(false)
  

  //shuffle cards
  const shuffleCards = () => { 
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
    .map((card) =>({...card,id:Math.random()}))
    
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
  }



  //handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  //compare 2 selected cards
  useEffect(() => {
    
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      // Compare the cards
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true }; // Mark as matched
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        // If not matched, reset after a brief delay to show both cards
        setTimeout(() => resetTurn(), 1000); // Wait for a second before resetting
      }
    }
  }, [choiceOne, choiceTwo]);
  

  console.log(cards)

  //reset choice and increase turn
  const resetTurn = () => { 
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  //to start a new game automatically
  useEffect(() => {
    shuffleCards()
  },[])
  
  return (
    <>
      <div className='App'>
        <h1>MEMORY MATCH</h1>
        <button onClick={shuffleCards}>Restart</button>
              <div className='turns'>
                  <p>Turns : {turns}</p>
        </div>
        <div className="card-grid">
          {cards.map(card => (
            <SingleCard
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped = {card === choiceOne || card === choiceTwo || card.matched}
              disabled = {disabled}
            />
          ))}
        </div>
       
      </div>
    </>
  );
}

export default MemoryMatch
