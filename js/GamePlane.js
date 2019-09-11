class GamePlane {
    // Properties
    canvas = null;
    canvasId = '';
    canvasWidth = null;
    canvasHeight = null;
    gridSize = null;
    tileSize = null;
    bgColor = 'black';
    freePositions = [];

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

        // Set freePositions array
        for (let index = 0; index < gridSize * gridSize; index++) {
            if (index == 0) {
                this.freePositions.push({x: 0, y: 0});
            }
            else {
                this.freePositions.push({
                    x: Math.floor(index / gridSize), 
                    y: index % gridSize
                });
            }
        }

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
    
    getFreePosition() {
        return this.freePositions[Math.floor(Math.random() * this.freePositions.length)];
    }

    removeFreePosition(position) {
        for (let i = this.freePositions.length - 1; i >= 0; --i) {
            if (this.freePositions[i].x == position.x && this.freePositions[i].y == position.y) {
                this.freePositions.splice(i, 1);
                break;
            }
        }
    }

    isPositionFree() {
        let result = false;



        return result;
    }

    getInfiniteNextPosition(position) {
        if (position.x < 0) { position.x = this.canvasWidth / this.tileSize }
        else if (position.x >= this.canvasWidth / this.tileSize) { position.x = 0 }
        else if (position.y < 0) { position.y = this.canvasHeight / this.tileSize }
        else if (position.y >= this.canvasHeight / this.tileSize) { position.y = 0 }

        return position;
    }

}