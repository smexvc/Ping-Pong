const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Constants
const PADDLE_WIDTH = 15, PADDLE_HEIGHT = 100, BALL_SIZE = 15;
const WINNING_SCORE = 5;

// Game objects
let paddleA = { x: 0, y: canvas.height / 2 - PADDLE_HEIGHT / 2, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
let paddleB = { x: canvas.width - PADDLE_WIDTH, y: canvas.height / 2 - PADDLE_HEIGHT / 2, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
let ball = { x: canvas.width / 2, y: canvas.height / 2, width: BALL_SIZE, height: BALL_SIZE, speedX: 0, speedY: 0 };

// Scores
let scoreA = 0;
let scoreB = 0;

// Control variables
let paddleSpeed = 7;
let ballSpeed = 7;

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.speedX = (Math.random() * 2 - 1) * ballSpeed;
    ball.speedY = (Math.random() * 2 - 1) * ballSpeed;
}

// Initialize game
resetBall();

// Handle keyboard events
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") paddleB.y -= paddleSpeed;
    if (event.key === "ArrowDown") paddleB.y += paddleSpeed;
    if (event.key === "w") paddleA.y -= paddleSpeed;
    if (event.key === "s") paddleA.y += paddleSpeed;
});

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(paddleA.x, paddleA.y, paddleA.width, paddleA.height);
    ctx.fillRect(paddleB.x, paddleB.y, paddleB.width, paddleB.height);

    // Draw ball
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    // Draw net
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "white";
    ctx.stroke();

    // Draw scores
    ctx.font = "74px Arial";
    ctx.fillText(scoreA, canvas.width / 4, 75);
    ctx.fillText(scoreB, 3 * canvas.width / 4, 75);
}

// Update game state
function update() {
    // Ball movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top and bottom
    if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Ball collision with paddles
    if (ball.speedX < 0 && ball.x <= paddleA.x + PADDLE_WIDTH && ball.y > paddleA.y && ball.y < paddleA.y + PADDLE_HEIGHT) {
        ball.speedX = -ball.speedX;
    } else if (ball.speedX > 0 && ball.x + BALL_SIZE >= paddleB.x && ball.y > paddleB.y && ball.y < paddleB.y + PADDLE_HEIGHT) {
        ball.speedX = -ball.speedX;
    }

    // Scoring
    if (ball.x <= 0) {
        scoreB++;
        resetBall();
    } else if (ball.x + BALL_SIZE >= canvas.width) {
        scoreA++;
        resetBall();
    }

    // Game over condition
    if (scoreA === WINNING_SCORE || scoreB === WINNING_SCORE) {
        alert(`Player ${scoreA === WINNING_SCORE ? "A" : "B"} wins!`);
        scoreA = 0;
        scoreB = 0;
        resetBall();
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
