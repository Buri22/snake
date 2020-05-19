class GamePlane {
    // Properties
    canvas = null;
    canvasWidth = null;
    canvasHeight = null;
    gridSize = null;
    tileSize = null;
    bgColor = '#000';
    freePositions = [];
    mode = null;
    getEatableCreaturesBodyPositions = null;

    constructor (gridSize, tileSize, mode, getEatableCreaturesBodyPositions) {
        this.gridSize = gridSize;
        this.tileSize = tileSize;
        this.canvasHeight = this.canvasWidth = gridSize * tileSize;
        this.mode = mode;
        this.getEatableCreaturesBodyPositions = getEatableCreaturesBodyPositions;

        // Get canvas context
        this.canvas = document.getElementById('canvas').getContext('2d');
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

    isPositionOutside(position) {
        if (position.x >= 0 && position.x < this.canvasWidth / this.tileSize
            && position.y >= 0 && position.y < this.canvasHeight / this.tileSize) {
            return false;
        }
        return true;
    }

    isPositionFree(position) {
        return this.freePositions.some(freePosition => 
            freePosition.x === position.x 
            && freePosition.y === position.y);
    }
    
    getFreePosition() {
        // Filter-out moving creatures
        const eatableBodyPositions = this.getEatableCreaturesBodyPositions();
        const freePositions = this.freePositions
            .filter(freePosition => !eatableBodyPositions
                .some(creaturePosition => 
                    creaturePosition.x === freePosition.x
                    && creaturePosition.y === freePosition.y)
            );
            
        return freePositions[Math.floor(Math.random() * freePositions.length)];
    }

    // Returns true if removal was successfull, otherwise returns false
    removeFreePosition(position) {
        const positionIndex = this.getFreePositionIndex(position);

        if (positionIndex !== -1) {
            this.removeFreePositionByIndex(positionIndex);
            return true;
        }

        return false;
    }

    removeFreePositionByIndex(index) {
        this.freePositions.splice(index, 1);
    }

    getFreePositionIndex(position) {
        return this.freePositions
            .findIndex(fp => fp.x === position.x && fp.y === position.y);
    }

    getInfiniteNextPosition(position) {
        if (position.x < 0) { position.x = this.canvasWidth / this.tileSize - 1 }
        else if (position.x >= this.canvasWidth / this.tileSize) { position.x = 0 }
        else if (position.y < 0) { position.y = this.canvasHeight / this.tileSize - 1 }
        else if (position.y >= this.canvasHeight / this.tileSize) { position.y = 0 }

        return position;
    }

}