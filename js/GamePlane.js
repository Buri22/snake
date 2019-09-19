class GamePlane {
    // Properties
    canvas = null;
    canvasWidth = null;
    canvasHeight = null;
    gridSize = null;
    tileSize = null;
    bgColor = 'black';
    freePositions = [];

    constructor (canvas, gridSize, tileSize) {
        this.gridSize = gridSize;
        this.tileSize = tileSize;
        this.canvasHeight = this.canvasWidth = gridSize * tileSize;

        // Get canvas context
        this.canvas = canvas;
        this.canvas.canvas.width = this.canvasWidth;
        this.canvas.canvas.height = this.canvasHeight;

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
        // this.canvas.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // draw all free positions
        this.freePositions.forEach(item => {
            this.canvas.fillRect(item.x * this.tileSize, item.y * this.tileSize, 
                this.tileSize, this.tileSize);
        });
    }

    positionIsOutside(position) {
        if (position.x >= 0 && position.x < this.canvasWidth / this.tileSize
            && position.y >= 0 && position.y < this.canvasHeight / this.tileSize) {
            return false;
        }
        return true;
    }
    
    getFreePosition() {
        let index = Math.floor(Math.random() * this.freePositions.length);
        return {
            index: index,
            position: this.freePositions[index]
        };
    }

    // Returns true if removal was successfull, otherwise returns false
    removeFreePosition(position) {
        for (let i = this.freePositions.length - 1; i >= 0; --i) {
            if (this.removeFreePositionByIndex(i, position)) {
                return true;
            }
        }
        return false;
    }
    removeFreePositionByIndex(index, position) {
        if (this.freePositions[index].x == position.x 
            && this.freePositions[index].y == position.y) {
            this.freePositions.splice(index, 1);
            return true;
        }
        return false;
    }

    isPositionFree(position) {
        for (const index in this.freePositions) {
            if (this.freePositions[index].x == position.x 
                && this.freePositions[index].y == position.y) {
                return Number(index);
            }
        }
        // for (const item of this.freePositions) {
        //     if (item.x == position.x && item.y == position.y) { return true; }
        // }
        return false;
    }

    getInfiniteNextPosition(position) {
        if (position.x < 0) { position.x = this.canvasWidth / this.tileSize }
        else if (position.x >= this.canvasWidth / this.tileSize) { position.x = 0 }
        else if (position.y < 0) { position.y = this.canvasHeight / this.tileSize }
        else if (position.y >= this.canvasHeight / this.tileSize) { position.y = 0 }

        return position;
    }

}