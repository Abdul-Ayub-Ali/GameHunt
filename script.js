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

const blockHeight = 50;
const blockWidth = 50;

let highScoreValue = localStorage.getItem("snakeHighScore") || 0;
let scoreValue = 0;

highScore.textContent = highScoreValue;

let seconds = 0;
let timerInterval = null;

const columns = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = [];

let intervalId = null;

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * columns),
};

const snake = [{ x: 1, y: 3 }];

let directions = "down";
let currentDirection = "down";

/* TIMER FUNCTIONS */

function startTimer() {
  timerInterval = setInterval(() => {

    seconds++;

    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;

    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    Time.textContent = `${mins}:${secs}`;

  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

/* CREATE BOARD */

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < columns; col++) {
    const block = document.createElement("div");
    block.classList.add("block");

    board.appendChild(block);

    blocks[`${row}-${col}`] = block;
  }
}

const renderSnake = () => {

  let head = null;

  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (directions === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } 
  else if (directions === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } 
  else if (directions === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } 
  else if (directions === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  /* GAME OVER */

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= columns) {

    clearInterval(intervalId);
    stopTimer();

    if (scoreValue > highScoreValue) {

      highScoreValue = scoreValue;

      localStorage.setItem("snakeHighScore", highScoreValue);

      highScore.textContent = highScoreValue;
    }

    modal.style.display = "flex";
    startGame.style.display = "none";
    gameOver.style.display = "flex";

    snake.length = 0;

    return;
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);

  /* FOOD EAT */

  if (head.x === food.x && head.y === food.y) {

    scoreValue += 10;

    score.textContent = scoreValue;

    blocks[`${food.x}-${food.y}`].classList.remove("food");

    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * columns),
    };

    snake.push(snake[snake.length - 1]);

  } else {

    snake.pop();

  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });

  currentDirection = directions;
};

/* START GAME */

btnStart.addEventListener("click", () => {

  modal.style.display = "none";

  clearInterval(intervalId);

  seconds = 0;
  scoreValue = 0;

  score.textContent = 0;
  Time.textContent = "00:00";

  startTimer();

  intervalId = setInterval(() => {
    renderSnake();
  }, 400);

});

/* RESTART GAME */

restartBtn.addEventListener("click", restartGame);

function restartGame() {

  clearInterval(intervalId);
  stopTimer();

  document.querySelectorAll(".block").forEach((block) => {
    block.classList.remove("fill");
    block.classList.remove("food");
  });

  snake.length = 0;

  snake.push({ x: 1, y: 3 });

  directions = "down";
  currentDirection = "down";

  seconds = 0;
  scoreValue = 0;

  score.textContent = 0;
  Time.textContent = "00:00";

  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * columns),
  };

  modal.style.display = "none";

  startTimer();

  intervalId = setInterval(() => {
    renderSnake();
  }, 400);

}

/* CONTROLS */

addEventListener("keydown", (e) => {

  if (e.key === "ArrowLeft" && currentDirection !== "right") {
    directions = "left";
  } 
  else if (e.key === "ArrowRight" && currentDirection !== "left") {
    directions = "right";
  } 
  else if (e.key === "ArrowUp" && currentDirection !== "down") {
    directions = "up";
  } 
  else if (e.key === "ArrowDown" && currentDirection !== "up") {
    directions = "down";
  }

});