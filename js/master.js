'use strict';
//import GamePlane from "GamePlane";

// Constants
// const DIRECTION = Object.freeze({left: 1, up: 2, right: 3, down: 4});
// const ARROW_KEY_CODES = Object.freeze({left: 37, up: 38, right: 39, down: 40});
// const GAME_PLANE_MODE = Object.freeze({infinite: 1, walls: 2});
// const TILE_SIZE = 15;
// const GRID_SIZE = 25;

// Global variables
var gamePlane = null,
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
    let snakeInitialLength = 3;

    // Prepare environment
    gamePlane = new GamePlane(GRID_SIZE, TILE_SIZE, GAME_PLANE_MODE.infinite);
    let snakeTrail = gamePlane.freePositions.splice(gamePlane.freePositions.length / 2 - snakeInitialLength, snakeInitialLength);
    snake = new Snake(snakeTrail, TILE_SIZE);
    fruit = new Fruit(GRID_SIZE, GRID_SIZE, TILE_SIZE, TILE_SIZE, gamePlane.getFreePosition());
    for (let index = 0; index < 10; index++) {
        movingCreatures.push(new Bug(gamePlane.getFreePosition(), TILE_SIZE));
    }

    // Start the game
    isGameOver = false;
    gameCycle = setInterval(run, snake.speed);

    // Listen to events
    window.addEventListener('keydown', toggleGamePause);

    //var app = new App();
});

function run() {
    let startTime = performance.now();
    let nextPosition = snake.getNextHeadPosition();

    // Check the walls
    if (gamePlane.isPositionOutside(nextPosition)) {
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
    if (!gamePlane.isPositionFree(nextPosition)) {
        console.log('Next Snake head position is not free...', nextPosition);
        gameOver();
        return;
    }
    
    // Remove newHeadPosition from free positions array
    if (!gamePlane.removeFreePosition(nextPosition)) {
        console.log('New Snake head position failed to remove from free positions...', nextPosition);
    }

    let isFruitEaten = fruit.isEaten(nextPosition);
    if (isFruitEaten) {
        fruit.setNewPosition(gamePlane.getFreePosition());
        snake.increaseLength();
        snake.numberOfEaten.apples++;
        console.log('Number of eaten apples: ' + snake.numberOfEaten.apples);
        
        // Check number of eaten apples to create bug
        if (snake.numberOfEaten.apples % 5 == 0) {
            let bug;            
            if (movingCreatures.length % 2 == 0) {
                // Create clever bug
                bug = new CleverBug(gamePlane.getFreePosition(), TILE_SIZE);
            }
            else {
                bug = new Bug(gamePlane.getFreePosition(), TILE_SIZE);
            }

            movingCreatures.push(bug);
            console.log('New Bug is in the game!');
        }
    }

    let isCreatureEaten = false;
    for (const key in movingCreatures) {
        const creature = movingCreatures[key];
        // Check if creature is eaten
        if (creature.isEaten(nextPosition)) {
            snake.increaseLength();
            isCreatureEaten = true;

            // Remove creature if has no body parts
            if (creature instanceof Bug && creature.length == 0) {
                movingCreatures.splice(key, 1);
                console.log('Bug was eaten!');
            }
        }
        else {
            // Otherwise -> move creature
            creature.move();
        }
    }

    // Snake gained length => increase speed
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
    if (snakeMoveResult.position != null 
        && snakeMoveResult.isFree) {
        // Add new free position
        gamePlane.freePositions.push(snakeMoveResult.position);
    }

    if (!isGameOver) {
        // Draw all game items
        gamePlane.draw(gamePlane.canvas);
        fruit.draw(gamePlane.canvas);
        snake.draw(gamePlane.canvas);
        movingCreatures.forEach(creature => creature.draw(gamePlane.canvas));
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
    let averageGCD = gameCycleDurations.reduce((a, b) => a + b, 0) / gameCycleDurations.length;
    console.log('Average GameCycle duration: ' + averageGCD + 'ms');
}