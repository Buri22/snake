class App {
    // App properties
    snake = null;

    gameInterval = null;
    isGameOver = null;
    gamePause = false;

    gameCycleDurations = null;

    constructor() {
        // Set properties
        let snakeInitialLength = 3;

        // Prepare environment
        gamePlane = new GamePlane(GRID_SIZE, TILE_SIZE, GAME_PLANE_MODE.infinite);
        let snakeTrail = gamePlane.freePositions.splice(gamePlane.freePositions.length / 2 - snakeInitialLength, snakeInitialLength);
        this.snake = new Snake(snakeTrail, TILE_SIZE);
        fruit = new Fruit(GRID_SIZE, GRID_SIZE, TILE_SIZE, TILE_SIZE, gamePlane.getFreePosition());
        movingCreatures.push(new CleverBug(gamePlane.getFreePosition(), TILE_SIZE));

        // Start the game
        this.isGameOver = false;
        this.gameInterval = setInterval(this.gameCycle.bind(this), this.snake.speed);
        this.gameCycleDurations = [];

        // Listen to events
        window.addEventListener('keydown', this.toggleGamePause.bind(this));
    };

    gameCycle() {
        let startTime = performance.now();
        let nextPosition = this.snake.getNextHeadPosition();

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
                    this.gameOver();
                    return;
            }
        }

        // Check nextPosition is free
        if (!gamePlane.isPositionFree(nextPosition)) {
            console.log('Next Snake head position is not free...', nextPosition);
            this.gameOver();
            return;
        }
        
        // Remove newHeadPosition from free positions array
        if (!gamePlane.removeFreePosition(nextPosition)) {
            console.log('New Snake head position failed to remove from free positions...', nextPosition);
        }

        let isFruitEaten = fruit.isEaten(nextPosition);
        if (isFruitEaten) {
            fruit.setNewPosition(gamePlane.getFreePosition());
            this.snake.increaseLength();
            this.snake.numberOfEaten.apples++;
            console.log(`Number of eaten apples: ${this.snake.numberOfEaten.apples}`);
            
            // Check number of eaten apples to create bug
            if (this.snake.numberOfEaten.apples % 5 == 0) {
                let bug;            
                if (movingCreatures.length % 1 == 0) {
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
            let creature = movingCreatures[key];
            // Check if creature is eaten
            if (creature.isEaten(nextPosition)) {
                this.snake.increaseLength();
                isCreatureEaten = true;

                // Remove creature if it has no body parts
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
            if (this.snake.length % 10 == 0) {
                // Change setInterval time
                this.snake.speed -= 10;
                if (this.snake.speed < 30) { this.snake.speed = 30; }
                
                // Reset game interval
                clearInterval(this.gameInterval);
                this.gameInterval = setInterval(this.gameCycle.bind(this), this.snake.speed);
            }
        }

        // Move snake
        let snakeMoveResult = this.snake.move(nextPosition);
        if (snakeMoveResult.position != null) {
            if (snakeMoveResult.isFree) {
                // Add new free position
                gamePlane.freePositions.push(snakeMoveResult.position);
            }
        }

        if (!this.isGameOver) {
            // Draw all game items
            gamePlane.draw();
            fruit.draw(gamePlane.canvas);
            this.snake.draw(gamePlane.canvas);
            movingCreatures.forEach(creature => creature.draw(gamePlane.canvas));
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
                this.gameInterval = setInterval(this.gameCycle.bind(this), this.snake.speed);
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