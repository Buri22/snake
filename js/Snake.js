const DIRECTION = {up: 1, right: 2, down: 3, left: 4};

class Snake {
    color = 'lime';
    shitColor = 'brown';
    length = null;
    width = null
    peaceSize = null;
    headPosition = {x: null, y: null};
    trail = [];
    shitTrail = [];
    speed = 150;                    // in milliseconds
    direction = DIRECTION.right;    // default direction
    canvas = null;
    moveIndex = 0;
    directionsStack = [];

    constructor (initialLength, initialWidth, peaceSize, initialX, initialY, canvasId) {
        this.canvas = document.getElementById(canvasId).getContext('2d');
        this.length = initialLength;
        this.width = initialWidth;
        this.peaceSize = peaceSize;
        this.headPosition.x = initialX;
        this.headPosition.y = initialY;

        // Initialize trail for the given length and initial position
        for (let index = 0; index < this.length; index++) {
            this.trail.unshift({x: this.headPosition.x - index, y: this.headPosition.y});
        }

        window.addEventListener('keydown', this.changeDirection.bind(this));

        this.draw();
    }

    move(newHeadPosition) {
        let newShit = null;
        while (this.trail.length >= this.length) {
            newShit = this.trail.shift();
        }

        this.trail.push(newHeadPosition);

        // Set new head position
        this.headPosition = newHeadPosition;

        if (newShit != null && this.doesMakeShit()) {
            this.shitTrail.push(newShit);
        }

        return true;
    }

    draw() {
        // Draw the snake
        this.canvas.fillStyle = this.color;
        this.trail.forEach(item => {
            this.canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width - 2, this.width - 2);
        });

        // Draw snake shit
        this.canvas.fillStyle = this.shitColor;
        this.shitTrail.forEach(item => {
            this.canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width - 2, this.width - 2);
        });
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

        return result;
    }

    increaseLength(x = 1) {
        this.length += x;
        console.log(this.length);
    }
    decreaseLength(x = 1) {
        this.length -= x;
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
        }
    }

    doesMakeShit() {
        return this.shitTrail.length < Math.floor(this.trail.length / 5) 
            && Math.floor(Math.random() * 100) < 25;
    }
}