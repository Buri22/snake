class Bug extends Moveable {
    canvas = null;
    color = null;
    width = null;
    moveTurnRate = 3;
    changeDirectionRate = 5;

    constructor(canvas, initialWidth) {
        let initialPosition = gamePlane.getFreePosition().position;
        super(initialPosition, [initialPosition], Math.floor(Math.random() * 3) + 1, DIRECTION.right);

        this.canvas = canvas;
        this.width = initialWidth;
        this.color = this.getRandomColor();
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

    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '';
        do {
            color = '#';
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * letters.length)];
            }
        }
        while (color === gamePlane.bgColor
            || color === snake.color
            || color === snake.shitColor
            || color === fruit.color)

        return color;
    }
}