class Bug extends Moveable {
    canvas = null;
    color = 'yellow';
    //body = [];
    length = 0;
    width = 0;
    //headPosition = null;

    constructor(canvasId, initialPosition, initialWidth) {
        super(initialPosition, [initialPosition], Math.floor(Math.random() * 3) + 1, DIRECTION.right);

        this.canvas = document.getElementById(canvasId).getContext('2d');
        //this.length = Math.floor(Math.random() * 3) + 1;
        //this.headPosition = initialPosition;
        this.width = initialWidth;
        
        // Initialize body for the given length and initial position
        // for (let index = 0; index < this.length; index++) {
        //     this.body.unshift({x: this.headPosition.x - index, y: this.headPosition.y});
        // }
        //this.body.push(this.headPosition);
    }

    // move(newHeadPosition) {
    //     while (this.body.length >= this.length) {
    //         this.body.shift();
    //     }

    //     this.body.push(newHeadPosition);

    //     // Set new head position
    //     this.headPosition = newHeadPosition;

    //     return result;
    // }

    draw() {
        this.canvas.fillStyle = this.color;
        this.body.forEach(item => {
            this.canvas.fillRect(item.x * this.width, item.y * this.width, 
                this.width - 2, this.width - 2);
        });
    }

    isEaten(position) {
        for (const index in this.body) {
            if (this.body[index].x == position.x && this.body[index].y == position.y) {
                this.body.splice(index, 1);
                return true;
            }
        }
        return false;
    }

}