const DIRECTION = {up: 1, right: 2, down: 3, left: 4};

class Snake {
    color = 'lime';
    shitColor = '#663300';
    length = null;
    width = null;
    headPosition = {x: null, y: null};
    trail = [];
    shitTrail = [];
    speed = 150;                    // in milliseconds
    direction = DIRECTION.down;     // default direction
    canvas = null;
    moveIndex = 0;
    directionsStack = [];

    constructor (initialTrail, initialWidth, canvasId) {
        this.canvas = document.getElementById(canvasId).getContext('2d');
        this.length = initialTrail.length;
        this.trail = initialTrail;
        this.headPosition = this.trail[this.length - 1];
        this.width = initialWidth;

        window.addEventListener('keydown', this.changeDirection.bind(this));

        this.draw();
    }

    // Input => new head position
    // Returns => new free position or shit position
    move(newHeadPosition) {
        let result = {
            position: null,
            isFree: true
        };

        while (this.trail.length >= this.length) {
            result.position = this.trail.shift();
        }

        this.trail.push(newHeadPosition);

        // Set new head position
        this.headPosition = newHeadPosition;

        if (result.position != null && this.doesMakeShit()) {
            this.shitTrail.push(result.position);
            result.isFree = false;
        }

        return result;
    }

    draw() {
        // Draw the snake
        this.canvas.fillStyle = this.color;
        this.trail.forEach(item => {
            // this.canvas.fillRect(item.x * this.width, item.y * this.width, 
            //     this.width - 2, this.width - 2);
            this.canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width, this.width);
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