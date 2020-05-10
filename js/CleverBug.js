class CleverBug extends Bug {
    constructor(initialPosition, initialWidth) {
        super(initialPosition, initialWidth);

        this.moveTurnRate = 3;
        this.changeDirectionRate = 0;
        this.drawStyle = DRAW_STYLE.circle;
    }

    move() {
        let possibleDirections = this.getPossibleDirections();
        if (possibleDirections.length === 1) {
            // Creature has just one possible free direction => take it
            this.direction = possibleDirections[0];
            return super.move();
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
                return super.move();
            }

            if (possibleDirections.length > 0) {
                if (possibleDirections.length === 1) {
                    this.direction = possibleDirections[0];
                }
                else {
                    this.direction = possibleDirections[Math.floor(Math.random() * 2)];
                }
                return super.move();
            }
        }
        return;
    }

    getPossibleDirections() {
        return Object.values(DIRECTION).filter(direction => {
            let newHeadPosition = this.getNextHeadPosition(direction);
            return gamePlane.isPositionFree(newHeadPosition) 
                && !this.isCreaturePosition(newHeadPosition);
        });
    }

    // Find directions moving closer to the fruit
    getDirectionsMovingCloser() {
        let directionsMovingCloser = [];
        if (fruit.position.x != this.headPosition.x) {
            if (fruit.position.x > this.headPosition.x) {
                directionsMovingCloser.push(DIRECTION.right);
            }
            else {
                directionsMovingCloser.push(DIRECTION.left);
            }
        }
        if (fruit.position.y != this.headPosition.y) {
            if (fruit.position.y > this.headPosition.y) {
                directionsMovingCloser.push(DIRECTION.down);
            }
            else {
                directionsMovingCloser.push(DIRECTION.up);
            }
        }
        return directionsMovingCloser;
    }
}