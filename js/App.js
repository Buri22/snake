//import EventBus from './EventBus';

// TODO: make Drawable class that will have methods: draw() and getRandomColor()

class App {
    // App properties
    gamePlane = null;
    fruit = null;
    snakes = [];
    bugs = [];

    gameInterval = null;
    gameSpeed = null;
    isGameOver = null;
    gamePause = false;

    gameCycleDurations = null;

    constructor() {
        // Set Environment
        this.gamePlane = new GamePlane(GRID_SIZE, TILE_SIZE, GAME_PLANE_MODE.infinite
            , this.getEatableCreaturesBodyPositions.bind(this));

        this.snakes.push(
            new Snake(this.generateSnakeTrail(), TILE_SIZE)
        );

        this.bugs.push(
            new CleverBug(this.gamePlane.getFreePosition(), TILE_SIZE
                , this.isPositionFree.bind(this), this.isCreaturePosition.bind(this)
                , this.getFruitPosition.bind(this))
        );
        
        this.fruit = new Fruit(GRID_SIZE, GRID_SIZE, TILE_SIZE, TILE_SIZE, this.gamePlane.getFreePosition());

        // Start the game
        this.isGameOver = false;
        this.gameSpeed = 150;    // in miliseconds
        this.gameInterval = setInterval(this.gameCycle.bind(this), this.gameSpeed);
        this.gameCycleDurations = [];

        // Listen to events
        window.addEventListener('keydown', this.toggleGamePause.bind(this));
        
        // const subscription = EventBus.subscribe(
        //     "print",
        //     message => console.log(`printing: ${message}`)
        //   )
    };

    gameCycle() {
        let startTime = performance.now();

        // Loop through snakes =================================================================
        for (const snake of this.snakes) {
            // Check if snake does move in this turn
            if (!snake.doesMoveThisTurn()) {
                snake.moveIndex++;
                continue;
            }

            // Get snake next head position
            let nextPosition = snake.getNextHeadPosition();

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
            if (!this.gamePlane.isPositionFree(nextPosition)) {
                console.log('Next Snake head position is not free...', nextPosition);
                this.gameOver();
                return;
            }
            
            // Remove newHeadPosition from free positions array
            if (!this.gamePlane.removeFreePosition(nextPosition)) {
                console.log('New Snake head position failed to remove from free positions...', nextPosition);
            }

            const isFruitEaten = this.fruit.isEaten(nextPosition);
            if (isFruitEaten) {
                this.fruit.setNewPosition(this.gamePlane.getFreePosition());
                snake.increaseLength();
                snake.numberOfEaten.apples++;
                console.log(`Number of eaten apples: ${snake.numberOfEaten.apples}`);
                
                // Check number of eaten apples to create bug
                if (snake.numberOfEaten.apples % 5 == 0) {
                    let bug;
                    const initialBugPosition = this.gamePlane.getFreePosition();
                    if (this.bugs.length % 3 == 0) {
                        bug = new Bug(initialBugPosition, TILE_SIZE);
                    }
                    else {
                        bug = new CleverBug(initialBugPosition, TILE_SIZE
                                , this.isPositionFree.bind(this), this.isCreaturePosition.bind(this)
                                , this.getFruitPosition.bind(this));
                    }

                    this.bugs.push(bug);
                    console.log('New Bug is in the game!');
                }
            }

            let isCreatureEaten = false;
            for (const key in this.bugs) {
                const bug = this.bugs[key];
                // Check if creature is eaten
                if (bug.isEaten(nextPosition)) {
                    snake.increaseLength(2);
                    isCreatureEaten = true;

                    // Remove creature if it has no body parts
                    if (bug instanceof Bug && bug.length == 0) {
                        this.bugs.splice(key, 1);
                        console.log('Bug was eaten!');
                    }
                }
            }

            // Snake gained length => increase gameSpeed
            if (isFruitEaten || isCreatureEaten) {
                // Check the gameSpeed change
                if (snake.length % 10 == 0) {
                    // Change setInterval time
                    this.gameSpeed -= 10;
                    if (this.gameSpeed < 30) { this.gameSpeed = 30; }
                    
                    // Reset game interval
                    clearInterval(this.gameInterval);
                    this.gameInterval = setInterval(this.gameCycle.bind(this), this.gameSpeed);
                }
            }

            // Move snake
            let snakeMoveResult = snake.move(nextPosition);
            if (snakeMoveResult.position != null) {
                if (snakeMoveResult.isFree) {
                    // Add new free position
                    this.gamePlane.freePositions.push(snakeMoveResult.position);
                }
            }
        }

        // Loop through bugs ===================================================================
        for (const bug of this.bugs) {
            // Check if bug does move in this turn
            if (!bug.doesMoveThisTurn()) {
                bug.moveIndex++;
                continue;
            }

            // Get bug next head position
            let nextPosition = bug.getNextHeadPosition();

            // Change direction
            bug.changeDirection();

            // Check bug can move in its direction
            if (this.gamePlane.isPositionOutside(nextPosition)
                || !this.gamePlane.isPositionFree(nextPosition)
                || this.isCreaturePosition(nextPosition)) {
                this.moveIndex++;
                continue;
            }
            
            // Check if fruit is eaten
            if (this.fruit.isEaten(nextPosition)) {
                this.fruit.setNewPosition(this.gamePlane.getFreePosition());
                bug.increaseLength();
                console.log('Bug eat fruit!', bug);
            }

            // Move Bug
            bug.move(nextPosition);
        }

        if (!this.isGameOver) {
            // Draw all game items
            this.gamePlane.draw();
            this.fruit.draw(this.gamePlane.canvas);

            this.snakes.forEach(snake => snake.draw(this.gamePlane.canvas));
            this.bugs.forEach(bug => bug.draw(this.gamePlane.canvas));
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
                this.gameInterval = setInterval(this.gameCycle.bind(this), this.gameSpeed);
            }
            else {
                this.gamePause = true;
                clearInterval(this.gameInterval);
            }
        }
    }

    gameOver() {
        // Game over
        // TODO refactor for handling multiple players
        clearInterval(this.gameInterval);
        this.isGameOver = true;
        console.log('Game over');
        const averageGCD = this.gameCycleDurations.reduce((a, b) => a + b, 0) / this.gameCycleDurations.length;
        console.log(`Average GameCycle duration: ${averageGCD}ms`);
    }

    generateSnakeTrail() {
        // Refactor this logic to work for multiple generated snakes
        const snakeInitialLength = 3;
        return this.gamePlane.freePositions.splice(
            this.gamePlane.freePositions.length / 2 - snakeInitialLength, snakeInitialLength);
    }

    isPositionFree(position) {
        return this.gamePlane.isPositionFree(position);
    }

    isCreaturePosition(position) {
        return this.bugs.some(creature => 
                creature.body.some(bodyPosition => 
                    bodyPosition.x === position.x && bodyPosition.y === position.y
                )
            );
    }

    getEatableCreaturesBodyPositions() {
        return this.bugs.map(mc => mc.body).flat();
    }

    getFruitPosition() {
        return this.fruit.position;
    }
}