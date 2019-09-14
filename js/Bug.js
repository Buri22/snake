class Bug extends Moveable {
    canvas = null;
    color = 'yellow';
    //body = [];
    //length = 0;
    width = null;
    //headPosition = null;

    constructor(canvas, initialPosition, initialWidth) {
        super(initialPosition, [initialPosition], Math.floor(Math.random() * 3) + 1, DIRECTION.right);

        this.canvas = canvas;
        //this.length = Math.floor(Math.random() * 3) + 1;
        //this.headPosition = initialPosition;
        this.width = initialWidth;
        
        // Initialize body for the given length and initial position
        // for (let index = 0; index < this.length; index++) {
        //     this.body.unshift({x: this.headPosition.x - index, y: this.headPosition.y});
        // }
        //this.body.push(this.headPosition);
    }

    move() {
        if (this.doChangeDirection()) {
            super.changeDirection({keyCode: Math.floor(Math.random() * 4) + 37});
        }
        if (this.isMoveTurn()) {
            let newHeadPosition = super.getNextHeadPosition();
            return super.move(newHeadPosition);
        }
        else {
            this.moveIndex++;
            return false;
        }
    }

    draw() {
        this.canvas.fillStyle = this.color;
        this.body.forEach(item => {
            this.canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width - 2, this.width - 2);
        });
    }

    doChangeDirection() {
        if (this.moveIndex % 5 == 0) return true;
        return false;
    }

    isMoveTurn() {
        if (this.moveIndex % 3 == 0) return true;
        return false;
    }

    isEaten(position) {
        for (const index in this.body) {
            if (this.body[index].x == position.x && this.body[index].y == position.y) {
                this.body.splice(index, 1);
                return true;
            }
        }
        return false;
    }

}