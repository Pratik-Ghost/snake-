const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');

const box = 20; // Size of each box (snake part and food)
const rows = 20;
const cols = 20;
canvas.width = cols * box;
canvas.height = rows * box;

let snake;
let food;
let score;
let direction;
let gameSpeed;
let game;
let gameOver = false;

function init() {
    snake = [{ x: Math.floor(cols / 2) * box, y: Math.floor(rows / 2) * box }];
    food = {
        x: Math.floor(Math.random() * cols) * box,
        y: Math.floor(Math.random() * rows) * box
    };
    score = 0;
    direction = null;
    gameSpeed = 150;
    gameOver = false;
    clearInterval(game);
    updateScore();
    gameOverOverlay.style.display = 'none'; // Hide game over screen
    startButton.style.display = 'none'; // Hide start button when game starts
    drawGame();  // Draw the initial game state
}

function setDirection(event) {
    if (gameOver) return;

    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    else if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function drawGame() {
    if (gameOver) return; // Stop the game loop if the game is over

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * cols) * box,
            y: Math.floor(Math.random() * rows) * box
        };
        updateGameSpeed();
        updateScore();
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        gameOver = true;
        showGameOverScreen();
        return;
    }

    snake.unshift(newHead);
}

function updateGameSpeed() {
    if (score % 5 === 0 && score !== 0) {
        clearInterval(game);
        gameSpeed = Math.max(20, gameSpeed - 10); // Reduced speed reduction rate
        game = setInterval(drawGame, gameSpeed);
    }
}

function updateScore() {
    scoreElement.innerText = 'Score: ' + score;
}

function showGameOverScreen() {
    gameOverOverlay.style.display = 'flex'; // Show the game over screen
    startButton.style.display = 'none'; // Hide the start button on game over
    restartButton.style.display = 'block'; // Show restart button on game over
}

restartButton.addEventListener('click', () => {
    init();
    game = setInterval(drawGame, gameSpeed);
});

startButton.addEventListener('click', () => {
    init();
    game = setInterval(drawGame, gameSpeed);
});

// Show start button initially
startButton.style.display = 'block';
restartButton.style.display = 'none'; // Hide restart button initially

document.addEventListener('keydown', (event) => {
    setDirection(event);
    if (gameOver && event.key === 'Enter') {
        init();
        game = setInterval(drawGame, gameSpeed);
    }
});
