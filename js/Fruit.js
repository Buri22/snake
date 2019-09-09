class Fruit {
    color = 'red';
    position = {x: null, y: null};
    maxX = null;
    maxY = null;
    height = null;
    width = null;
    canvas = null;

    constructor (maxX, maxY, width, height, canvasId, initialExcludePositions) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.width = width;
        this.height = height;
        this.canvas = document.getElementById(canvasId).getContext('2d');

        this.getNewPosition(initialExcludePositions);
        this.draw();
    }

    getNewPosition() {        
        this.position.x = Math.floor(Math.random() * this.maxX);
        this.position.y = Math.floor(Math.random() * this.maxY);

        return this.position;
    }

    draw() {
        this.canvas.fillStyle = this.color;
        this.canvas.fillRect(this.position.x * this.width, this.position.y * this.height, 
            this.width - 2, this.height - 2);
    }

    isEaten(position) {
        if (position.x == this.position.x && position.y == this.position.y) {
            return true;
        }
        return false;
    }
}