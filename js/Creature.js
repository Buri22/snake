class Creature extends Moveable {
    color = '';
    width = 0;
    moveTurnRate = 1;
    numberOfEaten = {
        apples: 0
    };

    constructor (headPosition, initialBody, bodyLength, initialWidth, initialDirection, color) {
        super(headPosition, initialBody, bodyLength, initialDirection);

        this.color = color || this.getRandomColor();
        this.width = initialWidth;
    }
    
    doesMoveThisTurn() {
        return this.moveIndex % this.moveTurnRate == 0;
    }

    draw() {
        console.log(`Creature ${typeof this} has not implemented draw() function...`);
    }

    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
          }

        return color;
    }
}