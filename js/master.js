//import GamePlane from "GamePlane";
// Global variables
var gamePlane = null;
var snake = null;
var fruit = null;
var gameCycle = null;
var isGameOver = null;

$(document).ready(function() {
    // Variables
    let canvasId = 'canvas';
    let gridSize = 20;
    let tileSize = 20;
    isGameOver = false;

    // Prepare environment
    gamePlane = new GamePlane(canvasId, gridSize, tileSize);
    snake = new Snake(3, tileSize, 20, 10, 10, canvasId);
    fruit = new Fruit(gridSize, gridSize, tileSize, tileSize, canvasId, snake.trail);

    // Start the game
    gameCycle = setInterval(run, snake.speed);
});

function run() {
    //let startTime = performance.now();
    let nextPosition = snake.getNextHeadPosition();
    // Put all occupied positions into one array
    let occupiedPositions = [];
    Array.prototype.push.apply(occupiedPositions, snake.trail);
    Array.prototype.push.apply(occupiedPositions, snake.shitTrail);

    let fruitWillBeEaten = fruit.isEaten(nextPosition);
    let newFruitPosition = null;
    let newFruitPositionIsFree = true;

    // Check the walls
    if (gamePlane.positionIsOutside(nextPosition)) { 
        // Game plane with walls
        gameOver();

        // Infinite Game plane
        //nextPosition = gamePlane.getInfiniteNextPosition(nextPosition);
    }

    // Iterate through all occupied positions and make all checks for each of them
    do {
        if (fruitWillBeEaten) {
            console.log('Trying to find new fruit position...');
            if (snake.length > gamePlane.gridSize * gamePlane.gridSize - gamePlane.gridSize * gamePlane.gridSize / 10) {
                // smarter way to generate new fruit position
                console.log('Not implemented smart new fruit position generation...');
                newFruitPosition = {x: -1, y: -1};
                fruit.position = newFruitPosition;
            } else {
                newFruitPosition = fruit.getNewPosition();
            }
            newFruitPositionIsFree = true;
        }

        for (const item of occupiedPositions) {
            // Check snake tail collision
            if (item.x == nextPosition.x && item.y == nextPosition.y) { gameOver(); break; }

            // Check new fruit position
            if (fruitWillBeEaten && item.x == newFruitPosition.x && item.y == newFruitPosition.y) { 
                newFruitPositionIsFree = false; 
                console.log('New fruit position is occupied...');
                break;
            }
        }
    } while (!newFruitPositionIsFree);

    if (fruitWillBeEaten) {
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

    // Move snake
    snake.move(nextPosition);

    if (!isGameOver) {
        // Draw all game items
        gamePlane.draw();
        fruit.draw();
        snake.draw();
    }
    
    //let endTime = performance.now();
    //console.log(`GameCycle took ${endTime - startTime}ms`);
}

function gameOver() {
    // Game over
    clearInterval(gameCycle);
    isGameOver = true;
    console.log('game over');
}