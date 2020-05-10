class App {
    // App properties
    gamePlane = null;
    snake = null;
    fruit = null;
    movingCreatures = [];

    gameInterval = null;
    isGameOver = null;
    gameCycleDurations = [];
    gamePause = false;

    constructor() {
        // Set properties
        //this.canvas = document.getElementById('canvas').getContext('2d');
        let snakeInitialLength = 3;

        // Prepare environment
        this.gamePlane = new GamePlane(GRID_SIZE, TILE_SIZE, GAME_PLANE_MODE.infinite);
        let snakeTrail = this.gamePlane.freePositions.splice(this.gamePlane.freePositions.length / 2 - snakeInitialLength, snakeInitialLength);
        this.snake = new Snake(snakeTrail, TILE_SIZE);
        this.fruit = new Fruit(GRID_SIZE, GRID_SIZE, TILE_SIZE, TILE_SIZE, this.gamePlane.getFreePosition());
        this.movingCreatures.push(new CleverBug(this.gamePlane.getFreePosition(), TILE_SIZE));

        // Start the game
        this.isGameOver = false;
        this.gameInterval = setInterval(this.gameCycle, this.snake.speed);

        // Listen to events
        window.addEventListener('keydown', this.toggleGamePause);
    };

    gameCycle() {
        let startTime = performance.now();
        let nextPosition = this.snake.getNextHeadPosition();

        // Check the walls
        if (this.gamePlane.isPositionOutside(nextPosition)) {
            switch (this.gamePlane.mode) {
                case GAME_PLANE_MODE.infinite:
                    // Infinite Game plane
                    nextPosition = this.gamePlane.getInfiniteNextPosition(nextPosition);
                    break;
                    
                case GAME_PLANE_MODE.walls:
                default:
                    // Game plane with walls
                    console.log('Next Snake head position is out of the Game Plane...', nextPosition);
                    this.gameOver();
                    return;
            }
        }

        // Check nextPosition is free
        let nextPositionIsFreeResult = this.gamePlane.isPositionFree(nextPosition);
        if (nextPositionIsFreeResult === false) {
            console.log('Next Snake head position is not free...', nextPosition);
            this.gameOver();
            return;
        }
        
        // Remove newHeadPosition from free positions array
        let removeFreePositionResult = this.gamePlane.removeFreePosition(nextPosition);
        if (!removeFreePositionResult) console.log('New Snake head position failed to remove from free positions...', nextPosition);

        let isFruitEaten = this.fruit.isEaten(nextPosition);
        if (isFruitEaten) {
            this.fruit.setNewPosition(this.gamePlane.getFreePosition());
            this.snake.increaseLength();
            this.snake.numberOfEaten.apples++;
            console.log(`Number of eaten apples: ${this.snake.numberOfEaten.apples}`);
            
            // Check number of eaten apples to create bug
            if (this.snake.numberOfEaten.apples % 5 == 0) {
                let bug;            
                if (this.movingCreatures.length % 1 == 0) {
                    // Create clever bug
                    bug = new CleverBug(this.gamePlane.getFreePosition(), TILE_SIZE);
                }
                else {
                    bug = new Bug(this.gamePlane.getFreePosition(), TILE_SIZE);
                }

                this.movingCreatures.push(bug);
                console.log('New Bug is in the game!');
            }
        }

        let isCreatureEaten = false;
        for (const creature of this.movingCreatures) {
            // Check if creature is eaten
            if (creature.isEaten(nextPosition)) {
                this.snake.increaseLength();
                isCreatureEaten = true;
            }
            else {
                // Otherwise -> move creature
                creature.move();
            }
        }

        // Snake gained length => increase speed
        if (isFruitEaten || isCreatureEaten) {
            // Check the snake speed change
            if (this.snake.length % 10 == 0) {
                // Change setInterval time
                this.snake.speed -= 10;
                if (this.snake.speed < 30) { this.snake.speed = 30; }
                
                // Reset game interval
                clearInterval(this.gameInterval);
                this.gameInterval = setInterval(this.gameCycle, this.snake.speed);
            }
        }

        // Move snake
        let snakeMoveResult = this.snake.move(nextPosition);
        if (snakeMoveResult.position != null) {
            if (snakeMoveResult.isFree) {
                // Add new free position
                this.gamePlane.freePositions.push(snakeMoveResult.position);
            }
        }

        if (!this.isGameOver) {
            // Draw all game items
            this.gamePlane.draw();
            this.fruit.draw(this.gamePlane.canvas);
            this.snake.draw(this.gamePlane.canvas);
            for (const key in this.movingCreatures) {
                const creature = this.movingCreatures[key];
                if (isCreatureEaten && creature instanceof Bug && creature.length == 0) {
                    this.movingCreatures.splice(key, 1);
                    console.log('Bug was eaten!');
                }
                else {
                    creature.draw(this.gamePlane.canvas);
                }
            }
        }
        
        let endTime = performance.now();
        this.gameCycleDurations.push(endTime - startTime);
        //console.log(`GameCycle took ${endTime - startTime}ms`);
    }

    toggleGamePause(event) {
        // Listen for key P
        if (event.keyCode == 80) {
            if (this.gamePause) {
                this.gamePause = false;
                this.gameInterval = setInterval(this.gameCycle, this.snake.speed);
            }
            else {
                this.gamePause = true;
                clearInterval(this.gameInterval);
            }
        }
    }

    gameOver() {
        // Game over
        clearInterval(this.gameInterval);
        this.isGameOver = true;
        console.log('Game over');
        let averageGCD = this.gameCycleDurations.reduce((a, b) => a + b, 0) / this.gameCycleDurations.length;
        console.log(`Average GameCycle duration: ${averageGCD}ms`);
    }
}