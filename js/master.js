//import GamePlane from "GamePlane";
// Global variables
var gamePlane = null;
var snake = null;
var fruit = null;
var gameCycle = null;

$(document).ready(function() {
    // Variables
    let gridSize = 40;
    let tileSize = 10;

    // Prepare environment
    gamePlane = new GamePlane('canvas', gridSize, tileSize);
    snake = new Snake(300, tileSize, 20, 10, 10, 'canvas');
    fruit = new Fruit(gridSize, gridSize, tileSize, tileSize, 'canvas', snake.trail);

    // Start the game
    gameCycle = setInterval(run, snake.speed);
});

function run() {
    //let startTime = performance.now();
    let continueGame = true;
    let nextPosition = snake.getNextHeadPosition();

    // Check the walls
    if (gamePlane.positionIsOutside(nextPosition)) { 
        // Game plane with walls
        continueGame = false;

        // Infinite Game plane
        //nextPosition = gamePlane.getInfiniteNextPosition(nextPosition);
    }

    // Check snake tail collision
    if (!snake.move(nextPosition)) { continueGame = false; }

    // Check the apple
    if (fruit.isEaten(nextPosition)) {
        snake.increaseLength();
        fruit.generateNewPosition(snake.trail);
        // Check the snake speed change
        if (snake.length % 10 == 0) {
            // Change setInterval time
            snake.speed -= 30;
            if (snake.speed < 30) { snake.speed = 30; }
            
            // Reset gameCycle interval
            clearInterval(gameCycle);
            gameCycle = setInterval(run, snake.speed);
        }
    }

    if (continueGame) {

        // Draw all game items
        gamePlane.draw();
        fruit.draw();
        snake.draw();
    }
    else {
        // Game over
        clearInterval(gameCycle);
        console.log('game over');
    }
    
    //let endTime = performance.now();
    //console.log(`GameCycle took ${endTime - startTime}ms`);
}