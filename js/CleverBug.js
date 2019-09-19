class CleverBug extends Bug {
    color = "#990099";

    constructor(canvas, initialWidth) {
        super(canvas, initialWidth);

        this.moveTurnRate = 3;
        this.changeDirectionRate = 0;
    }

    move() {
        // Choose randomly by which coordinate (x/y) will the Bug get closer to the Fruit
        if (Math.floor(Math.random() * 2) == 1) {
            // Find direction toward the fruit
            if (fruit.position.x != this.headPosition.x) {
                if (fruit.position.x > this.headPosition.x) {
                    // Go Right
                    this.tryToGoInDirection(DIRECTION.right);
                }
                else {
                    // Go Left
                    this.tryToGoInDirection(DIRECTION.left);
                }
            }
        }
        else {
            if (fruit.position.y != this.headPosition.y) {
                if (fruit.position.y > this.headPosition.y) {
                    // Go Down
                    this.tryToGoInDirection(DIRECTION.down);
                }
                else {
                    // Go Up
                    this.tryToGoInDirection(DIRECTION.up);
                }
            }
        }

        super.move();
    }

    tryToGoInDirection(direction) {
        let newHeadPosition = {
            x: this.headPosition.x, 
            y: this.headPosition.y
        };
        switch (direction) {
            case DIRECTION.left:
                newHeadPosition.x--;
                break;
            case DIRECTION.up:
                newHeadPosition.y--;
                break;
            case DIRECTION.right:
                newHeadPosition.x++;
                break;
            case DIRECTION.down:
                newHeadPosition.y++;
                break;
        
            default:
                break;
        }
        let isPositionFree = gamePlane.isPositionFree(newHeadPosition);

        if (isPositionFree == false) {
            // Next head position is not free
            super.changeDirectionRandomly();
        }
        else {
            // No obstacle is in the way
            this.direction = direction;
        }
    }
}