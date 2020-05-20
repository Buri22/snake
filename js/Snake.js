class Snake extends Creature {
    shitColor = '#663300';
    shitTrail = [];
    directionsStack = [];
    controlKeys = null;

    constructor (initialTrail, initialWidth, initialLength, initialDirection, controlKeys) {
        super(
            initialTrail
            , [initialTrail]
            , initialLength
            , initialWidth
            , initialDirection
        );

        this.controlKeys = controlKeys;

        window.addEventListener('keydown', this.changeDirection.bind(this));
    }

    // Override parent move() to create some shit
    move(newHeadPosition) {
        const result = super.move(newHeadPosition);

        if (result.position != null && this.doesMakeShit()) {
            this.shitTrail.push(result.position);
            result.isFree = false;
        }

        return result;
    }
    
    changeDirection(event) {
        let newDirection = null;
        switch (event.keyCode) {
            case this.controlKeys.left:
                newDirection = DIRECTION.left;
                break;
            case this.controlKeys.up:
                newDirection = DIRECTION.up;
                break;
            case this.controlKeys.right:
                newDirection = DIRECTION.right;
                break;
            case this.controlKeys.down:
                newDirection = DIRECTION.down;
                break;
        }

        // Defense
        if (newDirection === null) {
            return;
        }

        // Check current move directionsStack
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

    getNextHeadPosition() {
        // Try to get direction for current move from directionsStack
        if (this.directionsStack[this.moveIndex] != undefined) {
            this.direction = this.directionsStack[this.moveIndex];
        }

        return super.getNextHeadPosition(this.direction);
    }

    draw(canvas) {
        // Draw the snake
        canvas.fillStyle = this.color;
        this.body.forEach(item => {
            canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width, this.width);
        });

        // Draw snake shit
        canvas.fillStyle = this.shitColor;
        this.shitTrail.forEach(item => {
            canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width, this.width);
        });
    }

    doesMakeShit() {
        return false;
        return this.shitTrail.length < Math.floor(this.body.length / 5) 
            && Math.floor(Math.random() * 100) < 25;
    }
}