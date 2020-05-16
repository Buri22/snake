class Bug extends Creature {
    changeDirectionRate = 5;
    drawStyle = DRAW_STYLE.square;

    constructor(initialPosition, initialWidth) {
        super(
            initialPosition
            , [initialPosition]
            , Math.floor(Math.random() * 3) + 1
            , initialWidth
            , DIRECTION.down
        );

        this.moveTurnRate = 3;
    }

    changeDirection() {
        // Check if bug is going to change direction this turn
        if (this.moveIndex % this.changeDirectionRate == 0) {
            // Filter out opposite direction arrow key code
            let possibleKeys = Object.values(ARROW_KEY_CODES)
                .filter(direction => !this.areOppositeDirections(this.direction + 36, direction));
    
            super.changeDirection({ 
                keyCode: possibleKeys[Math.floor(Math.random() * 3)]
            });
        }
    }

    draw(canvas) {
        canvas.fillStyle = this.color;
        this.body.forEach(position => {
            canvas.fillRect(position.x * this.width + 1, position.y * this.width + 1, 
                this.width - 2, this.width - 2);
        });
    }

    isEaten(position) {
        for (const i in this.body) {
            if (this.body[i].x == position.x && this.body[i].y == position.y) {
                this.body.splice(i, 1);
                this.length--;
                return true;
            }
        }
        return false;
    }
}