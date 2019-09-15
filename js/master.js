//import GamePlane from "GamePlane";

// Constants
const DIRECTION = {left: 1, up: 2, right: 3, down: 4};
const TILE_SIZE = 15;
const GRID_SIZE = 25;

// Global variables
var canvas = null;
var gamePlane = null;
var snake = null;
var fruit = null;
var bug = null;
var gameCycle = null;
var isGameOver = null;
var gameCycleDurations = [];
var movingCreatures = [];
var gamePause = false;
var numberOfEatenApples = 0;
var isBugInGame = false;

$(document).ready(function() {
    // Variables
    canvas = document.getElementById('canvas').getContext('2d');
    let snakeInitialLength = 3;

    // Prepare environment
    gamePlane = new GamePlane(canvas, GRID_SIZE, TILE_SIZE);
    let snakeTrail = gamePlane.freePositions.splice(gamePlane.freePositions.length / 2 - snakeInitialLength, snakeInitialLength);
    snake = new Snake(snakeTrail, TILE_SIZE, canvas);
    fruit = new Fruit(GRID_SIZE, GRID_SIZE, TILE_SIZE, TILE_SIZE, canvas, gamePlane.getFreePosition().position);

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

    // Check nextPosition is free
    let nextPositionIsFreeResult = gamePlane.isPositionFree(nextPosition);
    if (nextPositionIsFreeResult == false) { gameOver(); return; }
    
    // Remove newHeadPosition from free positions array
    let removeFreePositionResult = gamePlane.removeFreePositionByIndex(nextPositionIsFreeResult, nextPosition);
    if (!removeFreePositionResult) console.log('New snake head position failed to remove from free positions...');

    let isFruitEaten = fruit.isEaten(nextPosition);
    if (isFruitEaten) {
        fruit.setNewPosition(gamePlane.getFreePosition().position);
        snake.increaseLength();
        numberOfEatenApples++;
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
        // Check number of aten apples to create bug
        if (!isBugInGame && numberOfEatenApples % 5 == 0) {
            let bug = new Bug(canvas, gamePlane.getFreePosition().position, TILE_SIZE);
            movingCreatures.push(bug);
            isBugInGame = true;
            console.log('Bug is in the game!');
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
        // if (isFruitEaten) {
        //     console.log('Number of free positions: ' + gamePlane.freePositions.length);
        //     console.log('Number of occupied positions: ' + occupiedPositions.length);
        // }

        // Draw all game items
        gamePlane.draw();
        fruit.draw();
        snake.draw();
        for (const key in movingCreatures) {
            const item = movingCreatures[key];
            if (isCreatureEaten && item instanceof Bug && item.length == 0) {
                movingCreatures.splice(key, 1);
                isBugInGame = false;
                console.log('Bug was eaten!');
            }
            else {
                item.draw();
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