class Snake extends Moveable {
    color = 'lime';
    shitColor = '#663300';
    width = null;
    shitTrail = [];
    speed = 150;                    // in milliseconds
    canvas = null;

    constructor (initialTrail, initialWidth, canvas) {
        super(initialTrail[initialTrail.length - 1], initialTrail, initialTrail.length, DIRECTION.down); // Define initial head position and direction
        
        this.canvas = canvas;
        this.width = initialWidth;

        window.addEventListener('keydown', this.changeDirection.bind(this));

        this.draw();
    }

    // Override parent move()
    move(newHeadPosition) {
        let result = super.move(newHeadPosition);

        if (result.position != null && this.doesMakeShit()) {
            this.shitTrail.push(result.position);
            result.isFree = false;
        }

        return result;
    }

    draw() {
        // Draw the snake
        this.canvas.fillStyle = this.color;
        this.body.forEach(item => {
            // this.canvas.fillRect(item.x * this.width, item.y * this.width, 
            //     this.width - 2, this.width - 2);
            this.canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width, this.width);
        });

        // Draw snake shit
        this.canvas.fillStyle = this.shitColor;
        this.shitTrail.forEach(item => {
            this.canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width - 2, this.width - 2);
        });
    }

    increaseLength(x = 1) {
        this.length += x;
        console.log(this.length);
    }
    decreaseLength(x = 1) {
        this.length -= x;
    }

    doesMakeShit() {
        return this.shitTrail.length < Math.floor(this.body.length / 5) 
            && Math.floor(Math.random() * 100) < 25;
    }
}