import { useEffect, useState } from 'react'
import './MemoryMatch.css'
import SingleCard from './SingleCard'
import { db, auth } from '../../../firebase'; // Firebase imports
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../NavBar/NavBar';

// Initial state for cards with empty array
const cardImages = [];

function MemoryMatch() {

  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled , setDisabled] = useState(false)

  // Fetch images from Firestore
  const fetchCardImages = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const imageCollectionRef = collection(db, 'users', user.uid, 'images');
      const querySnapshot = await getDocs(imageCollectionRef);
      
      const fetchedImages = querySnapshot.docs.map(doc => ({
        src: doc.data().base64, // Assuming images are stored as base64 strings
        matched: false,
      }));

      if (fetchedImages.length > 0) {
        // Shuffle and duplicate the fetched images for the game
        const shuffledCards = [...fetchedImages, ...fetchedImages]
          .sort(() => Math.random() - 0.5)
          .map(card => ({ ...card, id: Math.random() }));

        setCards(shuffledCards);
      } else {
        console.error("No images found for the user");
      }
    } catch (error) {
      console.error("Error fetching images: ", error);
    }
  };

  // Shuffle cards for the game
  const shuffleCards = () => { 
    fetchCardImages();
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(0)
  }

  // Handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  // Compare selected cards
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
        setTimeout(() => resetTurn(), 1000); // Wait for a second before resetting
      }
    }
  }, [choiceOne, choiceTwo]);

  // Reset the choices and increase turn
  const resetTurn = () => { 
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  // Automatically start a new game on mount
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <>
    <Navbar/>
      <div className='App'>
        <h1>MEMORY MATCH</h1>
        <button onClick={shuffleCards}>Restart</button>
        <div className='turns'>
          <p>Turns: {turns}</p>
        </div>
        <div className="card-grid">
          {cards.map(card => (
            <SingleCard
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default MemoryMatch;
