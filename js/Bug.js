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
        
        //return super.move(nextHeadPosition);
        
    }

    draw(canvas) {
        canvas.fillStyle = this.color;
        let r = this.width / 2;
        this.body.forEach(item => {
            switch (this.drawStyle) {
                case DRAW_STYLE.circle:
                    canvas.beginPath();
                    canvas.arc(item.x * this.width + r, item.y * this.width + r
                        , r, 0, 2 * Math.PI, false);
                    canvas.fill();
                    break;

                case DRAW_STYLE.square:
                default:
                    canvas.fillRect(item.x * this.width + 1, item.y * this.width + 1, 
                        this.width - 2, this.width - 2);
                    break;
            }
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