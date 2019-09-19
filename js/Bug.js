class Bug extends Moveable {
    canvas = null;
    color = 'yellow';
    width = null;
    moveTurnRate = 3;
    changeDirectionRate = 5;

    constructor(canvas, initialWidth) {
        let initialPosition = gamePlane.getFreePosition().position;
        super(initialPosition, [initialPosition], Math.floor(Math.random() * 3) + 1, DIRECTION.right);

        this.canvas = canvas;
        this.width = initialWidth;
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

                // Make checks if bug can move in this direction
                if (gamePlane.positionIsOutside(newHeadPosition)
                    || isNewHeadPositionFree == false) {
                    this.moveIndex++;
                    return false;
                }

                // Check if fruit is eaten
                if (fruit.isEaten(newHeadPosition)) {
                    fruit.setNewPosition(gamePlane.getFreePosition().position);
                    this.increaseLength();
                    console.log('Bug eat fruit!', this);
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
        // Calculate possible direction changes
        let previous = this.direction - 1 < 1 ? 40 : this.direction + 35;
        let next = this.direction + 1 > 4 ? 37 : this.direction + 37;
        let possibleKeys = [previous, this.direction + 36, next];
        super.changeDirection({ keyCode: possibleKeys[Math.floor(Math.random() * 3)] });
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

}