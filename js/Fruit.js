class Fruit extends Drawable {
    color = '#ff0707';
    position = {x: null, y: null};
    height = null;
    width = null;

    constructor (maxX, maxY, width, height, initialPosition) {
        super([initialPosition]);

        this.width = width;
        this.height = height;
    }

    setNewPosition(position) {
        this.body[0] = position;
    }

    draw(canvas) {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.body[0].x * this.width + 1, this.body[0].y * this.height + 1, 
            this.width - 2, this.height - 2);
    }

    isEaten(position) {
        if (position.x == this.body[0].x && position.y == this.body[0].y) {
            return true;
        }
        return false;
    }

    getBodyPositions() {
        return this.body[0];
    }
}