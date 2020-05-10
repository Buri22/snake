class Bug extends Creature {
    moveTurnRate = 3;
    changeDirectionRate = 5;

    constructor(canvas, initialWidth) {
        let initialPosition = gamePlane.getFreePosition();
        super(
            initialPosition
            , [initialPosition]
            , Math.floor(Math.random() * 3) + 1
            , initialWidth
            , DIRECTION.down
            , canvas
        );
    }

    move() {
        if (this.length > 0) {
            if (this.doAction(this.changeDirectionRate)) {
                this.changeDirectionRandomly();
            }
            // Check if bug is going to move this turn
            if (this.doAction(this.moveTurnRate)) {
                let newHeadPosition = super.getNextHeadPosition();
                let isNewHeadPositionFree = gamePlane.isPositionFree(newHeadPosition);
                isNewHeadPositionFree = !this.isCreaturePosition(newHeadPosition);

                // Make checks if bug can move in this direction
                if (gamePlane.positionIsOutside(newHeadPosition)
                    || isNewHeadPositionFree === false) {
                    this.moveIndex++;
                    return false;
                }

                // Check if fruit is eaten
                if (fruit.isEaten(newHeadPosition)) {
                    fruit.setNewPosition(gamePlane.getFreePosition());
                    this.increaseLength();
                    console.log('Bug eat fruit!', this);

                    if (this.length % 4 == 0) {
                        movingCreatures.push(new CleverBug(canvas, TILE_SIZE));
                    }
                }
    
                // Move
                super.move(newHeadPosition);

                return true;
            }
            else {
                this.moveIndex++;
            }
        }
        return false;
    }

    changeDirectionRandomly() {
        // Filter out opposite direction arrow key code
        let possibleKeys = Object.values(ARROW_KEY_CODES)
            .filter(direction => !this.areOppositeDirections(this.direction + 36, direction));

        super.changeDirection({ 
            keyCode: possibleKeys[Math.floor(Math.random() * 3)]
        });
    }

    draw() {
        this.canvas.fillStyle = this.color;
        this.body.forEach(item => {
            this.canvas.fillRect(item.x * this.width + 1, item.y * this.width + 1, 
                this.width - 2, this.width - 2);
        });
    }

    doAction(rate) {
        if (this.moveIndex % rate == 0) return true;
        return false;
    }

    isEaten(position) {
        for (const index in this.body) {
            if (this.body[index].x == position.x && this.body[index].y == position.y) {
                this.body.splice(index, 1);
                this.length--;
                return true;
            }
        }
        return false;
    }

    isCreaturePosition(position) {
        for (const creature of movingCreatures) {
            for (const bodyPosition of creature.body) {
                if (bodyPosition.x === position.x && bodyPosition.y === position.y) {
                    return true;
                }
            }
        }
        return false;
    }
}