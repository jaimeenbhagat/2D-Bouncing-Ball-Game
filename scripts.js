const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const popup = document.getElementById("popup");
const pauseMenu = document.getElementById("pause-menu");
const pauseBtn = document.getElementById("pause-btn");
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2; // Paddle position
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 5;
let brickColumnCount = 11;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let paused = false;
let difficulty = "easy";

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function setDifficulty(level) {
  difficulty = level;
  switch (level) {
    case "easy":
      dx = 3;
      dy = -3;
      brickRowCount = 3;
      break;
    case "medium":
      dx = 4;
      dy = -4;
      brickRowCount = 4;
      break;
    case "hard":
      dx = 5;
      dy = -5;
      brickRowCount = 5;
      break;
  }
  popup.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
  startGame();
}

function startGame() {
  score = 0;
  resetBricks();
  paddleX = (canvas.width - paddleWidth) / 2; // Reset paddle position
  x = paddleX + paddleWidth / 2; // Set ball x position to the center of the paddle
  y = canvas.height - paddleHeight - ballRadius - 1; // Set ball y position just above the paddle
  draw();
}

function resetBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1;
    }
  }
}

function togglePause() {
  paused = !paused;
  if (paused) {
    pauseMenu.classList.remove("hidden");
  } else {
    pauseMenu.classList.add("hidden");
  }
}

function resumeGame() {
  paused = false;
  pauseMenu.classList.add("hidden");
  draw();
}

function restartGame() {
  paused = false;
  score = 0;
  resetBricks();
  x = paddleX + paddleWidth / 2; // Reset ball position to start above the paddle
  y = canvas.height - paddleHeight - ballRadius - 1; // Reset ball position to start above the paddle
  draw();
  pauseMenu.classList.add("hidden");
}

function changeDifficulty() {
  paused = false;
  popup.classList.remove("hidden");
  pauseMenu.classList.add("hidden");
  pauseBtn.classList.add("hidden");
  restartGame(); // Call restartGame to reset ball position and other parameters
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  // Ball movement and collision with walls
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      alert('GAME OVER');
      setDifficulty();
      document.location.reload();
    }
  }

  // Paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;

  if (!paused) {
    requestAnimationFrame(draw);
  }
}

// Initialize game
paddleX = (canvas.width - paddleWidth) / 2;
x = paddleX + paddleWidth / 2;
y = canvas.height - paddleHeight - ballRadius - 1;
popup.classList.remove("hidden");
