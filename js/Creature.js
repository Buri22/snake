class Creature extends Moveable {
    name = '';
    color = '';
    width = 0;
    moveTurnRate = 1;
    numberOfEaten = {
        apples: 0,
        bugs: 0
    };

    constructor (headPosition, initialBody, bodyLength, initialWidth, initialDirection, color, name) {
        super(headPosition, initialBody, bodyLength, initialDirection);

        this.width = initialWidth;
        this.color = color || this.getRandomColor();
        this.name = name || this.getName();
    }
    
    doesMoveThisTurn() {
        return this.moveIndex % this.moveTurnRate == 0;
    }

    getName() {
        return NAME_ARRAY[Math.floor(Math.random() * NAME_ARRAY.length)];
    }
}