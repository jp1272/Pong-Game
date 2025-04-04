"use strict";

// Setup
const game = document.getElementById("game");
const context = game.getContext("2d");
const score1 = document.querySelector(".player1");
const score2 = document.querySelector(".player2");
const endGame = document.querySelector(".winner");

// Player
const playerWidth = 10;
const playerHeight = 100;
const playerSpeed = 8;

// Ball
const ballSize = 10;

let player1Score = 0;
let player2Score = 0;

const updateScore = function () {
  score1.textContent = player1Score;
  score2.textContent = player2Score;
};

class Player {
  // keep track of position
  // has a score
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = playerWidth;
    this.height = playerHeight;
    this.speed = playerSpeed;
  }

  drawPlayer(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  movePlayer(up, down) {
    if (up && this.y > 0) this.y -= this.speed;
    if (down && this.y < game.height - this.height) this.y += this.speed;
  }

  moveComputer() {
    const cpSpeed = 4;
    const delay = Math.random() * 10;
    const error = (Math.random() - 0.5) * 10;

    let targetY = ball.y + error;

    if (player2.y + player2.height / 2 < targetY - delay) {
      player2.y += cpSpeed; // Move down if ball is below
    } else if (player2.y + player2.height / 2 > targetY + delay) {
      player2.y -= cpSpeed; // Move up if ball is above
    }
  }
}

class Ball {
  // keep track of position
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = ballSize;
    this.speedX = 6;
    this.speedY = 6;
  }

  drawBall(ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  resetBall() {
    this.x = game.width / 2;
    this.y = game.height / 2;
    this.speedX = -this.speedX;
  }

  moveBall(player1, player2) {
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off canvas border
    if (this.y - this.size < 0 || this.y + this.size > game.height) {
      this.speedY = -this.speedY;
    }

    // Bounce off players
    if (
      (this.x - this.size < player1.x + player1.width &&
        this.y > player1.y &&
        this.y < player1.y + player1.height) ||
      (this.x + this.size > player2.x &&
        this.y > player2.y &&
        this.y < player2.y + player2.height)
    ) {
      this.speedX = -this.speedX;
    }

    if (this.x < 0) {
      player2Score += 1;
      updateScore();
      this.resetBall();
    }
    if (this.x > game.width) {
      player1Score += 1;
      updateScore();
      this.resetBall();
    }
  }
}

// Setup Game
const player1 = new Player(10, game.height / 2 - 40);
const player2 = new Player(game.width - 20, game.height / 2 - 40);
const ball = new Ball(game.width / 2, game.height / 2);

// Movement Tracking
let upPress = false;
let downPress = false;
let wPress = false;
let sPress = false;

// Handle
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") upPress = true;
  if (e.key === "ArrowDown") downPress = true;
  if (e.key === "w") wPress = true;
  if (e.key === "s") sPress = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") upPress = false;
  if (e.key === "ArrowDown") downPress = false;
  if (e.key === "w") wPress = false;
  if (e.key === "s") sPress = false;
});

const gameLoop = function () {
  context.clearRect(0, 0, game.width, game.height);

  // Move players
  player1.movePlayer(upPress, downPress);
  player2.moveComputer();

  // Move ball
  ball.moveBall(player1, player2);

  // Draw game pieces
  player1.drawPlayer(context);
  player2.drawPlayer(context);
  ball.drawBall(context);

  if (player1Score < 3 && player2Score < 3) {
    requestAnimationFrame(gameLoop);
  } else {
    cancelAnimationFrame(gameLoop);
    endGame.classList.remove("hidden");
  }
};

document.addEventListener("keypress", gameLoop);
