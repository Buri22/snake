class Snake extends Creature {
    shitColor = '#663300';
    shitTrail = [];
    speed = 150;    // in milliseconds

    constructor (initialTrail, initialWidth, canvas) {
        super(
            initialTrail[initialTrail.length - 1]
            , initialTrail
            , initialTrail.length
            , initialWidth
            , DIRECTION.down
            , canvas
            , '#0f0'
        );

        window.addEventListener('keydown', this.changeDirection.bind(this));
    }

    // Override parent move() to create some shit
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
            this.canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width, this.width);
        });

        // Draw snake shit
        this.canvas.fillStyle = this.shitColor;
        this.shitTrail.forEach(item => {
            this.canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width, this.width);
        });
    }

    doesMakeShit() {
        return this.shitTrail.length < Math.floor(this.body.length / 5) 
            && Math.floor(Math.random() * 100) < 25;
    }
}