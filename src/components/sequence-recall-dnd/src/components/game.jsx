import React, { useState, useEffect } from "react";
import "./style.css"; // Import your styles

const Game = () => {
  const [images, setImages] = useState([
    { id: "1", order: 0 },
    { id: "2", order: 1 },
    { id: "3", order: 2 },
  ]); // Example initial images
  const [originalOrder, setOriginalOrder] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [message, setMessage] = useState("Press Start to begin!");
  const [startDisabled, setStartDisabled] = useState(false);

  useEffect(() => {
    // Initialize the original order
    const initialOrder = images.map((image) => image.id);
    setOriginalOrder(initialOrder);
  }, [images]);

  const updateLevel = () => {
    console.log("Current Level Updated:", currentLevel);
  };

  const updateMessage = (text, type = "info") => {
    setMessage(text);
    console.log("Message Updated:", text);
  };

  const shuffleImages = () => {
    console.log("Shuffling images...");
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setImages(
      shuffled.map((image, index) => ({ ...image, order: index }))
    );
    console.log("Shuffled Order:", shuffled.map((img) => img.id));
  };

  const resetGame = () => {
    console.log("Resetting game...");
    setImages(
      originalOrder.map((id, index) => ({ id, order: index }))
    );
    setStartDisabled(false);
    updateMessage("Game reset. Press Start to play again.");
  };

  const checkIfSolved = () => {
    const currentOrder = images
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((img) => img.id);

    console.log("Current Order:", currentOrder);
    console.log("Original Order:", originalOrder);

    if (JSON.stringify(currentOrder) === JSON.stringify(originalOrder)) {
      setTimeout(() => {
        setCurrentLevel((prev) => prev + 1);
        updateMessage("Correct! Proceed to the next level.");
        shuffleImages();
      }, 200);
    } else {
      updateMessage("Wrong move! Try again.", "error");
    }
  };

  const handleDragStart = (e, draggedId) => {
    e.dataTransfer.setData("text/plain", draggedId);
    console.log("Drag Start:", draggedId);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");

    if (!draggedId || !targetId) {
      updateMessage("Invalid move. Try again.", "error");
      return;
    }

    console.log("Dropped:", { draggedId, targetId });

    const newImages = [...images];
    const draggedIndex = newImages.findIndex((img) => img.id === draggedId);
    const targetIndex = newImages.findIndex((img) => img.id === targetId);

    [newImages[draggedIndex].order, newImages[targetIndex].order] = [
      newImages[targetIndex].order,
      newImages[draggedIndex].order,
    ];

    setImages(newImages);
    checkIfSolved();
  };

  return (
    <div className="game">
      <h1>Image Puzzle Game</h1>
      <div id="level">Level: {currentLevel}</div>
      <div id="message">{message}</div>
      <div className="image-container">
        {images
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((image) => (
            <div
              key={image.id}
              className="image"
              data-id={image.id}
              draggable
              onDragStart={(e) => handleDragStart(e, image.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, image.id)}
            >
              Image {image.id}
            </div>
          ))}
      </div>
      <button id="startBtn" onClick={shuffleImages} disabled={startDisabled}>
        Start
      </button>
      <button id="restartBtn" onClick={resetGame}>
        Restart
      </button>
      <button
        id="quitBtn"
        onClick={() => {
          resetGame();
          setCurrentLevel(1);
          updateLevel();
          updateMessage("Game quit. Press Start to play again.");
        }}
      >
        Quit
      </button>
    </div>
  );
};

export default Game;
