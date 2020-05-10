class Fruit {
    color = '#ff0707';
    position = {x: null, y: null};
    maxX = null;
    maxY = null;
    height = null;
    width = null;

    constructor (maxX, maxY, width, height, initialPosition) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.width = width;
        this.height = height;
        this.position = initialPosition;
    }

    setNewPosition(position) {
        this.position = position;
    }

    draw(canvas) {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.position.x * this.width + 1, this.position.y * this.height + 1, 
            this.width - 2, this.height - 2);
    }

    isEaten(position) {
        if (position.x == this.position.x && position.y == this.position.y) {
            return true;
        }
        return false;
    }
}