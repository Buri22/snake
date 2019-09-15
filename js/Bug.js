class Bug extends Moveable {
    canvas = null;
    color = 'yellow';
    width = null;

    constructor(canvas, initialPosition, initialWidth) {
        super(initialPosition, [initialPosition], Math.floor(Math.random() * 3) + 1, DIRECTION.right);

        this.canvas = canvas;
        this.width = initialWidth;
    }

    move() {
        if (this.length > 0) {
            if (this.doChangeDirection()) {
                // Calculate possible direction changes
                let previous = this.direction - 1 < 1 ? 40 : this.direction + 35;
                let next = this.direction + 1 > 4 ? 37 : this.direction + 37;
                let possibleKeys = [previous, this.direction + 36, next];
                super.changeDirection({keyCode: possibleKeys[Math.floor(Math.random() * 3)]});
            }
            // Check if bug is going to move this turn
            if (this.isMoveTurn()) {
                let newHeadPosition = super.getNextHeadPosition();
    
                // Make checks if bug can move in this direction
    
    
                return super.move(newHeadPosition);
            }
            else {
                this.moveIndex++;
            }
        }
        return false;
    }

    draw() {
        this.canvas.fillStyle = this.color;
        this.body.forEach(item => {
            this.canvas.fillRect(item.x * this.width + 1, item.y * this.width + 1, 
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
                this.length--;
                console.log(this);
                return true;
            }
        }
        return false;
    }

}