document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const quitBtn = document.getElementById('quitBtn');
  const imageContainer = document.querySelector('.image-container');
  const messageDiv = document.getElementById('message');
  const levelDiv = document.getElementById('level');

  let images = Array.from(document.querySelectorAll('.image'));
  let originalOrder = images.map(image => image.getAttribute('data-id'));
  let currentLevel = 1;

  // Initialize orders
  images.forEach((image, index) => {
    image.style.order = index; // Set initial visual order
  });

  // Update the level display
  function updateLevel() {
    levelDiv.textContent = `Level: ${currentLevel}`;
    console.log("Current Level Updated:", currentLevel);
  }

  // Update the message display
  function updateMessage(text, type = 'info') {
    messageDiv.textContent = text;
    messageDiv.style.color = type === 'error' ? 'red' : 'black';
    console.log("Message Updated:", text);
  }

  // Shuffle images
  function shuffleImages() {
    console.log("Shuffling images...");
  
    // Shuffle the original order array
    const shuffledOrder = [...originalOrder].sort(() => Math.random() - 0.5);
    console.log("Shuffled Order:", shuffledOrder);
  
    // Apply the shuffled order to the images
    images.forEach((image, index) => {
      const newDataId = shuffledOrder[index];
      image.setAttribute('data-id', newDataId);  // Update data-id
      image.style.order = index;  // Update the visual order
    });
    currentOrder = shuffledOrder;
  
    // Log the visual order after shuffle
    const visualOrder = Array.from(images)
      .sort((a, b) => parseInt(a.style.order) - parseInt(b.style.order))
      .map(image => image.getAttribute('data-id'));
    console.log("Visual Order After Shuffle:", visualOrder);
  }
  

  // Reset images to the original order
  function resetGame() {
    console.log("Resetting game...");
    images.forEach((image, index) => {
      image.setAttribute('data-id', originalOrder[index]);
      image.style.order = index; // Restore visual order
    });
    updateMessage("Game reset. Press Start to play again.");
    console.log("Game Reset: Order Restored");
  }

  // Start button click
  startBtn.addEventListener('click', () => {
    shuffleImages();
    updateMessage("Rearrange the images to the correct order!");
    startBtn.disabled = true;
  });

  // Restart button click
  restartBtn.addEventListener('click', () => {
    resetGame();
    startBtn.disabled = false;
  });

  // Quit button click
  quitBtn.addEventListener('click', () => {
    resetGame();
    startBtn.disabled = false;
    currentLevel = 1;
    updateLevel();
    updateMessage("Game quit. Press Start to play again.");
  });

  // Swap elements
  function swapElements(draggedElement, targetElement) {
    console.log("Before Swap - Dragged:", draggedElement.dataset.id, "Target:", targetElement.dataset.id);

    // Swap their positions (order)
    const draggedIndex = parseInt(draggedElement.style.order);
    const targetIndex = parseInt(targetElement.style.order);

    draggedElement.style.order = targetIndex;
    targetElement.style.order = draggedIndex;

    // Swap data-id attributes for consistency
    const tempId = draggedElement.dataset.id;
    draggedElement.dataset.id = targetElement.dataset.id;
    targetElement.dataset.id = tempId;

    console.log("After Swap - Dragged:", draggedElement.dataset.id, "Target:", targetElement.dataset.id);
  }

  // Drag and drop functionality
  images.forEach(image => {
    image.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', e.target.dataset.id);
      e.dataTransfer.effectAllowed = "move"; // Indicates a move operation
      console.log("Drag Start:", e.target.dataset.id);
    });

    image.addEventListener('dragover', (e) => {
      e.preventDefault(); // Allow drop
      e.dataTransfer.dropEffect = "move";
    });

    image.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain');
      const targetId = e.target.dataset.id;

      if (!draggedId || !targetId) {
        updateMessage("Invalid move. Try again.", "error");
        return;
      }

      console.log("Dropped:", { draggedId, targetId });

      const draggedElement = document.querySelector(`[data-id="${draggedId}"]`);
      const targetElement = document.querySelector(`[data-id="${targetId}"]`);
      swapElements(draggedElement, targetElement);
      checkIfSolved();
    });
  });

  // Check if the puzzle is solved
  function checkIfSolved() {
    // Sort images by their visual order (style.order)
    const currentOrder = Array.from(images)
      .sort((a, b) => parseInt(a.style.order) - parseInt(b.style.order))
      .map(image => image.getAttribute('data-id'));

    console.log("Current Order:", currentOrder);
    console.log("Original Order:", originalOrder);

    if (JSON.stringify(currentOrder) === JSON.stringify(originalOrder)) {
      setTimeout(() => {
        currentLevel++;
        updateLevel();
        updateMessage("Correct! Proceed to the next level.");
        startNextLevel();
      }, 200);
    } else {
      updateMessage("Wrong move! Try again.", "error");
    }
  }

  function startNextLevel() {
    shuffleImages();
    updateMessage(`Level ${currentLevel}: Rearrange the images!`);
    updateLevel();
     updateMessage("Press Start to begin!");
  }
  updateLevel();
  updateMessage("Press Start to begin!");
  // Initialize the level and message
  
});
