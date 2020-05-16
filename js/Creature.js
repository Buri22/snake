class Creature extends Moveable {
    color = '';
    width = 0;
    moveTurnRate = 1;
    numberOfEaten = {
        apples: 0,
        bugs: 0
    };

    constructor (headPosition, initialBody, bodyLength, initialWidth, initialDirection, color) {
        super(headPosition, initialBody, bodyLength, initialDirection);

        this.color = color || this.getRandomColor();
        this.width = initialWidth;
    }
    
    doesMoveThisTurn() {
        return this.moveIndex % this.moveTurnRate == 0;
    }
}