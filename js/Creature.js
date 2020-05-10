class Creature extends Moveable {
    canvas = null;
    color = '';
    width = 0;
    numberOfEaten = {
        apples: 0
    };

    constructor (headPosition, initialBody, bodyLength, initialWidth, initialDirection, canvas, color) {
        super(headPosition, initialBody, bodyLength, initialDirection);

        this.canvas = canvas;
        this.color = color || this.getRandomColor();
        this.width = initialWidth;
    }

    draw() {
        console.log(`Creature ${typeof this} has not implemented draw() function...`);
    }

    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '';
        do {
            color = '#';
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * letters.length)];
            }
        }
        while (color === gamePlane.bgColor
            || color === snake.color
            || color === snake.shitColor
            || color === fruit.color)

        return color;
    }
}