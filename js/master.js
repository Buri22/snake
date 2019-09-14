//import GamePlane from "GamePlane";

// Constants
const DIRECTION = {up: 1, right: 2, down: 3, left: 4};

// Global variables
var gamePlane = null;
var snake = null;
var fruit = null;
var bug = null;
var gameCycle = null;
var isGameOver = null;
var gameCycleDurations = [];
var gamePause = false;

$(document).ready(function() {
    // Variables
    //let canvasId = 'canvas';
    let canvas = document.getElementById('canvas').getContext('2d');
    let gridSize = 25;
    let tileSize = 15;
    let snakeInitialLength = 3;

    // Prepare environment
    gamePlane = new GamePlane(canvas, gridSize, tileSize);
    let snakeTrail = gamePlane.freePositions.splice(gamePlane.freePositions.length / 2 - snakeInitialLength, snakeInitialLength);
    snake = new Snake(snakeTrail, tileSize, canvas);
    fruit = new Fruit(gridSize, gridSize, tileSize, tileSize, canvas, gamePlane.getFreePosition().position);
    bug = new Bug(canvas, gamePlane.getFreePosition().position, tileSize);

    // Start the game
    isGameOver = false;
    gameCycle = setInterval(run, snake.speed);

    // Listen to events
    window.addEventListener('keydown', toggleGamePause);
});

function run() {
    let startTime = performance.now();
    let nextPosition = snake.getNextHeadPosition();

    // Check the walls
    if (gamePlane.positionIsOutside(nextPosition)) { 
        // Game plane with walls
        gameOver();
        return;

        // Infinite Game plane
        //nextPosition = gamePlane.getInfiniteNextPosition(nextPosition);
    }

    // Iterate through all occupied positions and make all checks for each of them
    let occupiedPositions = [];
    Array.prototype.push.apply(occupiedPositions, snake.body);
    Array.prototype.push.apply(occupiedPositions, snake.shitTrail);
    
    // Check snake occupied positions collision
    for (const item of occupiedPositions) {
        if (item.x == nextPosition.x && item.y == nextPosition.y) { gameOver(); break; }
    }
    
    // Remove newHeadPosition from free positions array
    let removeFreePositionResult = gamePlane.removeFreePosition(nextPosition);
    if (!removeFreePositionResult) console.log('New snake head position failed to remove from free positions...');

    let isFruitEaten = fruit.isEaten(nextPosition);
    if (isFruitEaten) {
        fruit.setNewPosition(gamePlane.getFreePosition().position);
        snake.increaseLength();

        // Check the snake speed change
        if (snake.length % 10 == 0) {
            // Change setInterval time
            snake.speed -= 10;
            if (snake.speed < 30) { snake.speed = 30; }
            
            // Reset gameCycle interval
            clearInterval(gameCycle);
            gameCycle = setInterval(run, snake.speed);
        }
    }
    let isBugEaten = bug.isEaten(nextPosition);
    if (isBugEaten) {
        snake.increaseLength();
        console.log('Bug was eaten!!');
    }

    // Move snake
    let snakeMoveResult = snake.move(nextPosition);
    if (snakeMoveResult.position != null) {
        if (snakeMoveResult.isFree) {
            // Add new free position
            gamePlane.freePositions.push(snakeMoveResult.position);
        }
    }

    // Move Bug
    bug.move();

    if (!isGameOver) {
        // if (isFruitEaten) {
        //     console.log('Number of free positions: ' + gamePlane.freePositions.length);
        //     console.log('Number of occupied positions: ' + occupiedPositions.length);
        // }

        // Draw all game items
        gamePlane.draw();
        fruit.draw();
        bug.draw();
        snake.draw();
    }
    
    let endTime = performance.now();
    gameCycleDurations.push(endTime - startTime);
    //console.log(`GameCycle took ${endTime - startTime}ms`);
}

function toggleGamePause(event) {
    // Listen for key P
    if (event.keyCode == 80) {
        if (gamePause) {
            gamePause = false;
            gameCycle = setInterval(run, snake.speed);
        }
        else {
            gamePause = true;
            clearInterval(gameCycle);
        }
    }
}

function gameOver() {
    // Game over
    clearInterval(gameCycle);
    isGameOver = true;
    console.log('Game over');
    averageGCD = gameCycleDurations.reduce((a, b) => a + b, 0) / gameCycleDurations.length;
    console.log('Average GameCycle duration: ' + averageGCD + 'ms');
}