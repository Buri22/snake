//import EventBus from './EventBus';

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
        this.gamePlane = new GamePlane(25, 15, GAME_PLANE_MODE.infinite);
        
        this.fruit = new Fruit(this.gamePlane.gridSize, this.gamePlane.gridSize
            , this.gamePlane.tileSize, this.gamePlane.tileSize, this.getFreePosition());

        for (let i = 0; i < 1; i++) {
            this.snakes.push(
                new Snake(this.getInitialSnakeHead(i), this.gamePlane.tileSize, 10, i + 1, CONTROL_KEY_SETS[i])
            );
        }

        for (let i = 0; i < 5; i++) {
            this.bugs.push(
                new CleverBug(this.getFreePositionAndRemove(), this.gamePlane.tileSize
                    , this.isMoveablePosition.bind(this), this.isCreaturePosition.bind(this)
                    , this.fruit.getBodyPositions.bind(this.fruit))
               //, new Bug(this.getFreePositionAndRemove(), this.gamePlane.tileSize)
            );    
        }
        
        // const subscription = EventBus.subscribe(
        //     "print",
        //     message => console.log(`printing: ${message}`)
        //   )
    };

    // Start the game
    startGame() {
        this.isGameOver = false;
        this.gameSpeed = 150;    // in miliseconds
        this.gameInterval = setInterval(this.gameCycle.bind(this), this.gameSpeed);
        this.gameCycleDurations = [];

        // Listen to events
        window.addEventListener('keydown', this.toggleGamePause.bind(this));
    }

    gameCycle() {
        const startTime = performance.now();

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
                        console.log(`Next Snake ${snake.name} head position is out of the Game Plane: `, nextPosition);
                        this.gameOver();
                        return;
                }
            }

            //Check Fruit isEaten
            if (this.fruit.isEaten(nextPosition)) {
                // Set new Fruit position
                this.fruit.setNewPosition(this.getFreePosition());

                // Inrease Snake length + check game speed change
                snake.increaseLength();
                this.handleGameSpeedChange(snake.body.length);
                
                // Check number of eaten apples to create bug
                snake.numberOfEaten.apples++;
                this.handleBugCreation(snake.numberOfEaten.apples);
                console.log(`Snake ${snake.name} already eaten ${snake.numberOfEaten.apples} apples`);

                // Remove last fruit position / new snake head position from gamePlane
                this.gamePlane.tryToRemove(nextPosition);
                snake.move(nextPosition);
            }
            else {
                // Check creature isEaten
                let isCreatureEaten = false;
                for (const key in this.bugs) {
                    const bug = this.bugs[key];
    
                    // Check if creature is eaten
                    if (bug.isEaten(nextPosition)) {
                        snake.increaseLength(2);
                        snake.move(nextPosition);
                        this.handleGameSpeedChange(snake.length - 1);
                        isCreatureEaten = true;
    
                        // Remove creature if it has no body parts
                        if (bug.length == 0) {
                            this.bugs.splice(key, 1);
                            snake.numberOfEaten.bugs++;
                            console.log(`Snake ${snake.name} ate Bug ${bug.name}! 
    ${snake.name} already eaten ${snake.numberOfEaten.bugs} bugs`);
                        }

                        break;
                    }
                }

                if (!isCreatureEaten) {
                    // Try to remove nextPosition from GamePlane
                    if (this.gamePlane.tryToRemove(nextPosition)) {
                        // Move snake
                        this.gamePlane.tryToAddPosition(snake.move(nextPosition));
                    }
                    else {
                        console.log(`Next Snake ${snake.name} head position is not free:`, nextPosition);
                        this.gameOver();
                        return;
                    }
                }
            }

            // snake.body.forEach(position => {
            //     if (this.gamePlane.freePositions.some(GPposition => GPposition.x === position.x && GPposition.y === position.y)) {
            //         console.log('snake body interferes with gameplane positions');
            //     }
            // });
        }

        // Loop through bugs ===================================================================
        for (const bug of this.bugs) {
            // Check if bug does move in this turn
            if (!bug.doesMoveThisTurn()) {
                bug.moveIndex++;
                continue;
            }

            // Change direction
            bug.changeDirection();

            // Get bug next head position
            let nextPosition = bug.getNextHeadPosition();
            
            // Check if fruit is eaten
            if (this.fruit.isEaten(nextPosition)) {
                this.fruit.setNewPosition(this.getFreePosition());
                bug.increaseLength();
                bug.numberOfEaten.apples++;
                console.log(`Bug ${bug.name} just eat fruit!`);

                // Remove last fruit position / new snake head position from gamePlane
                this.gamePlane.tryToRemove(nextPosition);
                // Move Bug
                bug.move(nextPosition)
            }
            // Check if gamePlane has nextPosition
            else if (this.gamePlane.tryToRemove(nextPosition)) {
                // Move Bug and add free position that bug left behind
                this.gamePlane.tryToAddPosition(bug.move(nextPosition));
            }
            else {
                bug.moveIndex++;
            }
            // bug.body.forEach(position => {
            //     if (this.gamePlane.freePositions.some(GPposition => GPposition.x === position.x && GPposition.y === position.y)) {
            //         console.log('bug body interferes with gameplane positions');
            //     }
            // });
        }

        if (!this.isGameOver) {
            // Draw all game items
            this.gamePlane.draw();
            this.fruit.draw(this.gamePlane.canvas);

            this.snakes.forEach(snake => snake.draw(this.gamePlane.canvas));
            this.bugs.forEach(bug => bug.draw(this.gamePlane.canvas));
        }
        
        this.gameCycleDurations.push(performance.now() - startTime);
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

        // Statistics
        if (this.gameCycleDurations.length > 0) {
            const averageGCD = this.gameCycleDurations.reduce((a, b) => a + b) / this.gameCycleDurations.length;
            console.log(`Average GameCycle duration: ${averageGCD}ms`);
        }

        this.snakes
            .sort((a, b) => b.numberOfEaten.apples - a.numberOfEaten.apples)
            .forEach(snake => {
                console.log(`Snake ${snake.name}
    Length: ${snake.length}
    Eaten Apples: ${snake.numberOfEaten.apples}
    Eaten Bugs: ${snake.numberOfEaten.bugs}`);
            });

        this.bugs
            .sort((a, b) => b.numberOfEaten.apples - a.numberOfEaten.apples)
            .forEach(bug => {
                console.log(`Bug ${bug.name}
    Length: ${bug.length}
    Eaten Apples: ${bug.numberOfEaten.apples}`);
            });
    }

    handleGameSpeedChange(input) {
        // Check the gameSpeed change
        if (input % 10 == 0) {
            // Change setInterval time => increase gameSpeed
            this.gameSpeed -= 10;
            if (this.gameSpeed < 30) { this.gameSpeed = 30; }
            
            // Reset game interval
            clearInterval(this.gameInterval);
            this.gameInterval = setInterval(this.gameCycle.bind(this), this.gameSpeed);
        }
    }
    handleBugCreation(input) {
        if (input % 5 == 0) {
            let bug;
            if (this.bugs.length % 3 == 0) {
                bug = new Bug(this.getFreePositionAndRemove(), this.gamePlane.tileSize);
            }
            else {
                bug = new CleverBug(this.getFreePositionAndRemove(), this.gamePlane.tileSize
                    , this.isMoveablePosition.bind(this), this.isCreaturePosition.bind(this)
                    , this.fruit.getBodyPositions.bind(this.fruit));
            }

            this.bugs.push(bug);
            console.log(`New Bug ${bug.name} is in the game!`);
        }
    }

    getInitialSnakeHead(snakeIndex) {
        const coordinate = Math.floor(this.gamePlane.gridSize / 2) + snakeIndex;
        const result = { x: coordinate, y: coordinate };

        this.gamePlane.tryToRemove(result);

        return result;
    }

    isMoveablePosition(position) {
        return this.gamePlane.isMoveablePosition(position);
    }

    isCreaturePosition(position) {
        return this.bugs.some(creature => 
                creature.body.some(bodyPosition => 
                    bodyPosition.x === position.x && bodyPosition.y === position.y
                )
            );
    }

    getRandomPositionIndex() {
        return Math.floor(Math.random() * this.gamePlane.freePositions.length);
    }
    getFreePosition() {
        const randomPositionIndex = this.getRandomPositionIndex();
        return this.gamePlane.freePositions[randomPositionIndex];
    }
    getFreePositionAndRemove() {
        const randomPositionIndex = this.getRandomPositionIndex();
        const randomPosition = this.gamePlane.freePositions[randomPositionIndex];
        this.gamePlane.removeFreePositionByIndex(randomPositionIndex);
        return randomPosition;
    }
}