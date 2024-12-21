const buttons = document.querySelectorAll(".button");
const gameButtons = document.querySelectorAll(".game-buttons");
const Message = document.getElementById("Message");
const level = document.getElementById("level-display");


let sequence = [];
let playerSequence = [];
let inProgress = false;

const playSequence = async() => {
  inProgress = true;
  for (let color of sequence) {
    const button = document.getElementById(color);
    button.classList.add("active");
    await new Promise(res => setTimeout(res, 600)); 
    button.classList.remove("active");
    await new Promise(res => setTimeout(res, 400));  flashes
  }
  inProgress = false;

};

const startGame = () => {
  messageDisplay.textContent = "";
  playerSequence = [];
  sequence.push(["red","green", "yellow", "blue"] , Math.floor(Math.random()*4));
  playSequence();


};

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

startButton.addEventListener("click", () => {
  console.log("Start button clicked");
  sequence = [];
  level = 1;
  levelDisplay.textContent = `Level: ${level}`;
  startGame();
});





