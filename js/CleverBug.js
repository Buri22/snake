class CleverBug extends Bug {
    isMoveablePosition = null;
    isCreaturePosition = null;
    getFruitPosition = null;

    constructor(initialPosition, initialWidth, isMoveablePosition, isCreaturePosition, getFruitPosition) {
        super(initialPosition, initialWidth);

        this.moveTurnRate = 2;
        this.changeDirectionRate = 0;
        this.drawStyle = DRAW_STYLE.circle;

        this.isMoveablePosition = isMoveablePosition;
        this.isCreaturePosition = isCreaturePosition;
        this.getFruitPosition = getFruitPosition;
    }

    changeDirection() {
        let possibleDirections = this.getPossibleDirections();
        if (possibleDirections.length === 1) {
            // Creature has just one possible free direction => take it
            this.direction = possibleDirections[0];
            return;
        }
        else if (possibleDirections.length > 1) {
            let directionsMovingCloser = this.getDirectionsMovingCloser();
            let possibleDirectionGettingCloser = possibleDirections.filter(direction => directionsMovingCloser.includes(direction));

            if (possibleDirectionGettingCloser.length > 0) {
                if (possibleDirectionGettingCloser.length === 1) {
                    this.direction = possibleDirectionGettingCloser[0];
                }
                else {
                    this.direction = possibleDirectionGettingCloser[Math.floor(Math.random() * 2)];
                }
                return;
            }

            if (possibleDirections.length > 0) {
                if (possibleDirections.length === 1) {
                    this.direction = possibleDirections[0];
                }
                else {
                    this.direction = possibleDirections[Math.floor(Math.random() * 2)];
                }
                return;
            }
        }
    }

    getPossibleDirections() {
        return Object.values(DIRECTION).filter(direction => {
            let newHeadPosition = this.getNextHeadPosition(direction);
            return this.isMoveablePosition(newHeadPosition);
                //&& !this.isCreaturePosition(newHeadPosition);
        });
    }

    // Find directions moving closer to the fruit
    getDirectionsMovingCloser() {
        const frutiPosition = this.getFruitPosition();
        let directionsMovingCloser = [];
        if (frutiPosition.x != this.headPosition.x) {
            if (frutiPosition.x > this.headPosition.x) {
                directionsMovingCloser.push(DIRECTION.right);
            }
            else {
                directionsMovingCloser.push(DIRECTION.left);
            }
        }
        if (frutiPosition.y != this.headPosition.y) {
            if (frutiPosition.y > this.headPosition.y) {
                directionsMovingCloser.push(DIRECTION.down);
            }
            else {
                directionsMovingCloser.push(DIRECTION.up);
            }
        }
        return directionsMovingCloser;
    }

    draw(canvas) {
        canvas.fillStyle = this.color;
        let r = this.width / 2;
        this.body.forEach(item => {
            canvas.beginPath();
            canvas.arc(item.x * this.width + r, item.y * this.width + r
                , r, 0, 2 * Math.PI, false);
            canvas.fill();
        });
    }
}