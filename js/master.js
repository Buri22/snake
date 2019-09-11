//import GamePlane from "GamePlane";
// Global variables
var gamePlane = null;
var snake = null;
var fruit = null;
var bug = null;
var gameCycle = null;
var isGameOver = null;
var gameCycleDurations = [];

$(document).ready(function() {
    // Variables
    let canvasId = 'canvas';
    let gridSize = 25;
    let tileSize = 15;

    // Prepare environment
    gamePlane = new GamePlane(canvasId, gridSize, tileSize);
    snakeTrail = gamePlane.freePositions.splice(gamePlane.freePositions.length / 2 - 300, 300);
    snake = new Snake(snakeTrail, tileSize, canvasId);
    fruit = new Fruit(gridSize, gridSize, tileSize, tileSize, canvasId, gamePlane.getFreePosition());
    bug = new Bug(canvasId, gamePlane.getFreePosition(), tileSize);

    // Start the game
    isGameOver = false;
    gameCycle = setInterval(run, snake.speed);
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
    Array.prototype.push.apply(occupiedPositions, snake.trail);
    Array.prototype.push.apply(occupiedPositions, snake.shitTrail);
    
    // Check snake occupied positions collision
    for (const item of occupiedPositions) {
        if (item.x == nextPosition.x && item.y == nextPosition.y) { gameOver(); break; }
    }

    let isFruitEaten = fruit.isEaten(nextPosition);
    if (isFruitEaten) {
        fruit.setNewPosition(gamePlane.getFreePosition());
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
    
    // Remove newHeadPosition from free positions array
    gamePlane.removeFreePosition(nextPosition);

    // Move snake
    let snakeMoveResult = snake.move(nextPosition);
    if (snakeMoveResult.position != null) {
        if (snakeMoveResult.isFree) {
            // Add new free position
            gamePlane.freePositions.push(snakeMoveResult.position);
        }
    }

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

function gameOver() {
    // Game over
    clearInterval(gameCycle);
    isGameOver = true;
    console.log('Game over');
    averageGCD = gameCycleDurations.reduce((a, b) => a + b, 0) / gameCycleDurations.length;
    console.log('Average GameCycle duration: ' + averageGCD + 'ms');
}