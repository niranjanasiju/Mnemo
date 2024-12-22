const buttons = document.querySelectorAll(".button");
const startButton = document.getElementById("start-button");
const levelDisplay = document.getElementById("level");
const messageDisplay = document.getElementById("message");
const restartButton = document.getElementById("restart-button");

// Game variables
let correctOrder = ["part1", "part2", "part3", "part4"];
let shuffledOrder = [];
let userOrder = [];
let level = 1;
let inProgress = false;
let isRestarting = false; // Declare the variable here

// Restart button logic
restartButton.addEventListener("click", () => {
  console.log("Restart button clicked");
  isRestarting = true; // Set the restart flag
  sequence = [];
  playerSequence = [];
  level = 1;
  levelDisplay.textContent = `Level: ${level}`;
  messageDisplay.textContent = "Game Restarted!";
  setTimeout(() => {
    isRestarting = false; // Reset the restart flag
    startGame();
  }, 0);
});

// Play the sequence
const playSequence = async () => {
  console.log("Playing sequence:", sequence);
  inProgress = true;
  for (let color of sequence) {
    if (isRestarting) break; // Stop the sequence if restarting
    const button = document.getElementById(color);
    button.classList.add("active");
    await new Promise(res => setTimeout(res, 600)); // Flash for 600ms
    button.classList.remove("active");
    await new Promise(res => setTimeout(res, 400)); // Pause between flashes
  }
  inProgress = false;
};

// Start a new round
const startGame = () => {
  console.log("Starting game");
  messageDisplay.textContent = "";
  playerSequence = [];
  sequence.push(["red", "blue", "green", "yellow"][Math.floor(Math.random() * 4)]);
  playSequence();
};

// Handle player input
buttons.forEach(button => {
  button.addEventListener("click", () => {
    if (inProgress) return;

    const color = button.id;
    playerSequence.push(color);
    console.log("Player sequence:", playerSequence);

    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 300);

    // Check player's sequence
    const index = playerSequence.length - 1;
    if (playerSequence[index] !== sequence[index]) {
      messageDisplay.textContent = "Game Over! Try Again!";
      sequence = [];
      level = 1;
      levelDisplay.textContent = `Level: ${level}`;
      return;
    }

    if (playerSequence.length === sequence.length) {
      level++;
      levelDisplay.textContent = `Level: ${level}`;
      playerSequence = [];
      setTimeout(startGame, 1000);
    }
  });
});

// Start button logic
startButton.addEventListener("click", () => {
  console.log("Start button clicked");
  sequence = [];
  level = 1;
  levelDisplay.textContent = `Level: ${level}`;
  startGame();
});
