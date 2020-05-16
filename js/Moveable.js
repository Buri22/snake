class Moveable extends Drawable {
    moveIndex = 0;
    direction = null;
    directionsStack = [];
    //body = null;
    length = 0;
    headPosition = {x: null, y: null};

    constructor(headPosition, initialBody, bodyLength, initialDirection) {
        super(initialBody);

        this.headPosition = headPosition;
        //this.body = initialBody;
        this.length = bodyLength;
        this.direction = initialDirection;
    }
    
    // Input => new head position
    // Returns => new free position or shit position (not free ;)
    move(newHeadPosition) {
        let result = {
            position: null,
            isFree: true
        };

        while (this.body.length >= this.length) {
            result.position = this.body.shift();
        }

        this.body.push(newHeadPosition);

        // Set new head position
        this.headPosition = newHeadPosition;

        this.moveIndex++;
        return result;
    }
    
    changeDirection(event) {
        let newDirection = null;
        switch (event.keyCode) {
            case ARROW_KEY_CODES.left:
                newDirection = DIRECTION.left;
                break;
            case ARROW_KEY_CODES.up:
                newDirection = DIRECTION.up;
                break;
            case ARROW_KEY_CODES.right:
                newDirection = DIRECTION.right;
                break;
            case ARROW_KEY_CODES.down:
                newDirection = DIRECTION.down;
                break;
        }

        // Check current move directionsStack
        if (newDirection != null) {
            if (this.directionsStack[this.moveIndex] == undefined
                && this.direction != newDirection
                && !this.areOppositeDirections(this.direction, newDirection)) {
                this.directionsStack.length = 0;
                this.directionsStack[this.moveIndex] = newDirection;
                this.direction = newDirection;
            }
            else if (!this.areOppositeDirections(this.directionsStack[this.directionsStack.length - 1], newDirection))
            {
                this.directionsStack.push(newDirection);
            }
        }
    }

    getNextHeadPosition(direction = null) {
        let result = {
            x: this.headPosition.x,
            y: this.headPosition.y
        };

        if (this.directionsStack[this.moveIndex] != undefined) {
            this.direction = this.directionsStack[this.moveIndex];
        }

        switch (direction || this.direction) {
            case DIRECTION.up:
                result.y--;
                break;
            case DIRECTION.down:
                result.y++;
                break;
            case DIRECTION.left:
                result.x--;
                break;
            case DIRECTION.right:
                result.x++;
                break;
        }
        
        return result;
    }


    increaseLength(x = 1) {
        this.length += x;
        console.log(this.length);
    }
    decreaseLength(x = 1) {
        this.length -= x;
    }

    areOppositeDirections(direction1, direction2) {
        if (direction1 <= 2) {
            return direction1 + 2 === direction2;
        }
        else {
            return direction1 - 2 === direction2;
        }
    }
}