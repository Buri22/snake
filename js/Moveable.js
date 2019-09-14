class Moveable {
    moveIndex = 0;
    direction = null;
    directionsStack = [];
    body = null;
    length = 0;
    headPosition = {x: null, y: null};

    constructor(headPosition, initialBody, bodyLength, initialDirection) {
        this.headPosition = headPosition;
        this.body = initialBody;
        this.length = bodyLength;
        this.direction = initialDirection;
    }
    
    // Input => new head position
    // Returns => new free position or shit position
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

        //this.moveIndex++;
        return result;
    }
    
    changeDirection(event) {
        let newDirection;
        switch (event.keyCode) {
            case 37:
                newDirection = DIRECTION.left;
                break;
            case 38:
                newDirection = DIRECTION.up;
                break;
            case 39:
                newDirection = DIRECTION.right;
                break;
            case 40:
                newDirection = DIRECTION.down;
                break;
        
            default:
                newDirection = 0;
                break;
        }

        // Check current move directionsStack
        if (newDirection != 0) {
            if (this.directionsStack[this.moveIndex + 1] == undefined) {
                this.directionsStack.length = 0;
                this.directionsStack[this.moveIndex + 1] = newDirection;
                this.direction = newDirection;
            } else if(this.directionsStack[this.moveIndex + 1] != newDirection) {
                this.directionsStack[this.moveIndex + 2] = newDirection;
            }
            //console.log('Direction was changed');
        }
    }

    getNextHeadPosition() {
        let result = {
            x: this.headPosition.x,
            y: this.headPosition.y
        };
        this.moveIndex++;

        if (this.directionsStack[this.moveIndex] != undefined) {
            this.direction = this.directionsStack[this.moveIndex];
        }

        switch (this.direction) {
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
        
            default:
                break;
        }
        //console.log(this.direction);
        return result;
    }

}