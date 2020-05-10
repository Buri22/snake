//import GamePlane from "GamePlane";

// Constants
const DIRECTION = Object.freeze({left: 1, up: 2, right: 3, down: 4});
const ARROW_KEY_CODES = Object.freeze({left: 37, up: 38, right: 39, down: 40});
const TILE_SIZE = 15;
const GRID_SIZE = 25;
const GAME_PLANE_MODE = Object.freeze({infinite: 1, walls: 2});

// Global variables
var canvas = null,
    gamePlane = null,
    snake = null,
    fruit = null,
    bug = null,
    gameCycle = null,
    isGameOver = null,
    gameCycleDurations = [],
    movingCreatures = [],
    gamePause = false;

document.addEventListener("DOMContentLoaded", function() {
    // Variables
    canvas = document.getElementById('canvas').getContext('2d');
    let snakeInitialLength = 3;

    // Prepare environment
    gamePlane = new GamePlane(canvas, GRID_SIZE, TILE_SIZE, GAME_PLANE_MODE.infinite);
    let snakeTrail = gamePlane.freePositions.splice(gamePlane.freePositions.length / 2 - snakeInitialLength, snakeInitialLength);
    snake = new Snake(snakeTrail, TILE_SIZE, canvas);
    fruit = new Fruit(GRID_SIZE, GRID_SIZE, TILE_SIZE, TILE_SIZE, canvas, gamePlane.getFreePosition());
    movingCreatures.push(new CleverBug(canvas, TILE_SIZE));

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
        switch (gamePlane.mode) {
            case GAME_PLANE_MODE.infinite:
                // Infinite Game plane
                nextPosition = gamePlane.getInfiniteNextPosition(nextPosition);
                break;
                
            case GAME_PLANE_MODE.walls:
            default:
                // Game plane with walls
                console.log('Next Snake head position is out of the Game Plane...', nextPosition);
                gameOver();
                return;
        }
    }

    // Check nextPosition is free
    let nextPositionIsFreeResult = gamePlane.isPositionFree(nextPosition);
    if (nextPositionIsFreeResult === false) {
        console.log('Next Snake head position is not free...', nextPosition);
        gameOver();
        return;
    }
    
    // Remove newHeadPosition from free positions array
    let removeFreePositionResult = gamePlane.removeFreePosition(nextPosition);
    if (!removeFreePositionResult) console.log('New Snake head position failed to remove from free positions...', nextPosition);

    let isFruitEaten = fruit.isEaten(nextPosition);
    if (isFruitEaten) {
        fruit.setNewPosition(gamePlane.getFreePosition());
        snake.increaseLength();
        snake.numberOfEaten.apples++;
        console.log('Number of eaten apples: ' + snake.numberOfEaten.apples);
        
        // Check number of eaten apples to create bug
        if (snake.numberOfEaten.apples % 5 == 0) {
            let bug;            
            if (movingCreatures.length % 1 == 0) {
                // Create clever bug
                bug = new CleverBug(canvas, TILE_SIZE);
            }
            else {
                bug = new Bug(canvas, TILE_SIZE);
            }

            movingCreatures.push(bug);
            console.log('New Bug is in the game!');
        }
    }

    let isCreatureEaten = false;
    for (const creature of movingCreatures) {
        // Check if creature is eaten
        if (creature.isEaten(nextPosition)) {
            snake.increaseLength();
            isCreatureEaten = true;
        }
        else {
            // Otherwise -> move creature
            creature.move();
        }
    }

    if (isFruitEaten || isCreatureEaten) {
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
    let snakeMoveResult = snake.move(nextPosition);
    if (snakeMoveResult.position != null) {
        if (snakeMoveResult.isFree) {
            // Add new free position
            gamePlane.freePositions.push(snakeMoveResult.position);
        }
    }

    if (!isGameOver) {
        // Draw all game items
        gamePlane.draw();
        fruit.draw();
        snake.draw();
        for (const key in movingCreatures) {
            const creature = movingCreatures[key];
            if (isCreatureEaten && creature instanceof Bug && creature.length == 0) {
                movingCreatures.splice(key, 1);
                console.log('Bug was eaten!');
            }
            else {
                creature.draw();
            }
        }
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