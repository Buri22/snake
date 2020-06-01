import {Drawable} from './Drawable.js';
export class Moveable extends Drawable {
    moveIndex = 0;
    direction = null;
    length = 0;
    headPosition = {x: null, y: null};

    constructor(headPosition, initialBody, bodyLength, initialDirection) {
        super(initialBody);

        this.headPosition = headPosition;
        this.length = bodyLength;
        this.direction = initialDirection;
    }
    
    // Input => new head position
    // Returns => new free position
    move(newHeadPosition) {
        let result = {
            position: null,
            isFree: false
        };

        while (this.body.length >= this.length) {
            result.position = this.body.shift();
            result.isFree = true;
        }

        this.body.push(newHeadPosition);

        // Set new head position
        this.headPosition = newHeadPosition;

        this.moveIndex++;
        return result;
    }
    
    changeDirection() {
        console.log('This moveable has not implemented its changeDirection function.');
    }

    getNextHeadPosition(direction = null) {
        let result = {
            x: this.headPosition.x,
            y: this.headPosition.y
        };

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
        //console.log(this.length);
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