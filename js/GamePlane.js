class GamePlane {
    // Properties
    canvas = null;
    canvasId = '';
    canvasWidth = null;
    canvasHeight = null;
    gridSize = null;
    tileSize = null;
    bgColor = 'black';

    constructor (canvasId, gridSize, tileSize) {
        this.canvasId = canvasId;
        this.gridSize = gridSize;
        this.tileSize = tileSize;
        this.canvasHeight = this.canvasWidth = gridSize * tileSize;

        // Set canvas Width and Height
        $('#' + this.canvasId)
            .attr('width', this.canvasWidth)
            .attr('height', this.canvasHeight);

        // Get canvas context
        this.canvas = document.getElementById(this.canvasId).getContext('2d');

        // Draw the default layout
        this.draw();
    }

    draw() {
        // draw background
        this.canvas.fillStyle = this.bgColor;
        this.canvas.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    positionIsOutside(position) {
        if (position.x >= 0 && position.x < this.canvasWidth / this.tileSize
            && position.y >= 0 && position.y < this.canvasHeight / this.tileSize) {
            return false;
        }
        return true;
    }

    getInfiniteNextPosition(position) {
        if (position.x < 0) { position.x = this.canvasWidth / this.tileSize }
        else if (position.x >= this.canvasWidth / this.tileSize) { position.x = 0 }
        else if (position.y < 0) { position.y = this.canvasHeight / this.tileSize }
        else if (position.y >= this.canvasHeight / this.tileSize) { position.y = 0 }

        return position;
    }

}