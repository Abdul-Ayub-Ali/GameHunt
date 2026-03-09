const game = (selector) => document.querySelector(selector);

const board = game(".board");
const btnStart = game(".btn-start");
const modal = game(".modal");
const startGame = game(".start-game");
const gameOver = game(".game-over");
const restartBtn = game(".btn-restart");

const highScore = game(".high-score");
const score = game(".score");
const Time = game(".time");

const blockSize = 50;

let columns;
let rows;

let blocks = {};

let snake;
let direction;
let currentDirection;

let food;

let intervalId;
let timerInterval;

let seconds;
let scoreValue;

let highScoreValue = localStorage.getItem("snakeHighScore") || 0;

if (highScore) highScore.textContent = highScoreValue;



/* CREATE BOARD */

function createBoard() {

  columns = Math.floor(board.clientWidth / blockSize);
  rows = Math.floor(board.clientHeight / blockSize);

  board.innerHTML = "";
  blocks = {};

  for (let r = 0; r < rows; r++) {

    for (let c = 0; c < columns; c++) {

      const block = document.createElement("div");
      block.classList.add("block");

      board.appendChild(block);

      blocks[`${r}-${c}`] = block;

    }
  }
}



/* TIMER */

function startTimer() {

  timerInterval = setInterval(() => {

    seconds++;

    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;

    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    if (Time) Time.textContent = `${mins}:${secs}`;

  }, 1000);

}

function stopTimer() {

  clearInterval(timerInterval);

}



/* SPAWN FOOD */

function spawnFood() {

  if (food) {

    blocks[`${food.x}-${food.y}`].classList.remove("food");

  }

  while (true) {

    let x = Math.floor(Math.random() * rows);
    let y = Math.floor(Math.random() * columns);

    let collision = snake.some(seg => seg.x === x && seg.y === y);

    if (!collision) {

      food = { x, y };

      blocks[`${x}-${y}`].classList.add("food");

      break;

    }

  }

}



/* GAME LOOP */

function renderSnake() {

  let head = { ...snake[0] };

  if (direction === "left") head.y--;
  if (direction === "right") head.y++;
  if (direction === "up") head.x--;
  if (direction === "down") head.x++;



  /* WALL COLLISION */

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= columns) {

    return endGame();

  }



  /* SELF COLLISION */

  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {

    return endGame();

  }



  snake.unshift(head);



  /* FOOD EAT */

  if (head.x === food.x && head.y === food.y) {

    scoreValue += 10;

    if (score) score.textContent = scoreValue;

    spawnFood();

  }

  else {

    let tail = snake.pop();

    blocks[`${tail.x}-${tail.y}`].classList.remove("fill");

  }



  blocks[`${head.x}-${head.y}`].classList.add("fill");



  currentDirection = direction;

}



/* GAME OVER */

function endGame() {

  clearInterval(intervalId);
  stopTimer();

  if (scoreValue > highScoreValue) {

    highScoreValue = scoreValue;

    localStorage.setItem("snakeHighScore", highScoreValue);

    if (highScore) highScore.textContent = highScoreValue;

  }

  modal.style.display = "flex";
  startGame.style.display = "none";
  gameOver.style.display = "flex";

}



/* RESET GAME */

function resetGame() {

  clearInterval(intervalId);
  stopTimer();

  document.querySelectorAll(".block").forEach(b => {

    b.classList.remove("fill");
    b.classList.remove("food");

  });

  snake = [{ x: 3, y: 3 }];

  direction = "right";
  currentDirection = "right";

  seconds = 0;
  scoreValue = 0;

  if (score) score.textContent = 0;
  if (Time) Time.textContent = "00:00";

  spawnFood();

  startTimer();

  intervalId = setInterval(renderSnake, 250);

}



/* START BUTTON */

btnStart.addEventListener("click", () => {

  modal.style.display = "none";

  resetGame();

});



/* RESTART BUTTON */

restartBtn.addEventListener("click", () => {

  modal.style.display = "none";

  resetGame();

});



/* CONTROLS */

addEventListener("keydown", (e) => {

  if (e.key === "ArrowLeft" && currentDirection !== "right") direction = "left";

  else if (e.key === "ArrowRight" && currentDirection !== "left") direction = "right";

  else if (e.key === "ArrowUp" && currentDirection !== "down") direction = "up";

  else if (e.key === "ArrowDown" && currentDirection !== "up") direction = "down";

});



/* INIT */

createBoard();