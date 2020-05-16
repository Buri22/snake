class Snake extends Creature {
    shitColor = '#663300';
    shitTrail = [];

    constructor (initialTrail, initialWidth) {
        super(
            initialTrail[initialTrail.length - 1]
            , initialTrail
            , initialTrail.length
            , initialWidth
            , DIRECTION.down
            , '#0f0'
        );

        window.addEventListener('keydown', this.changeDirection.bind(this));
    }

    // Override parent move() to create some shit
    move(newHeadPosition) {
        const result = super.move(newHeadPosition);

        if (result.position != null && this.doesMakeShit()) {
            this.shitTrail.push(result.position);
            result.isFree = false;
        }

        return result;
    }

    draw(canvas) {
        // Draw the snake
        canvas.fillStyle = this.color;
        this.body.forEach(item => {
            canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width, this.width);
        });

        // Draw snake shit
        canvas.fillStyle = this.shitColor;
        this.shitTrail.forEach(item => {
            canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width, this.width);
        });
    }

    doesMakeShit() {
        return this.shitTrail.length < Math.floor(this.body.length / 5) 
            && Math.floor(Math.random() * 100) < 25;
    }
}