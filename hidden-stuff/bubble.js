// example class using p5 js
// processing is out of style, we're old ig

class Bubble {
    constructor() {
        this.x = 200;
        this.y = 150;
    }

    move() {
        this.x = this.x + random(-5, 5);
        this.y = this.y + random(-5, 5);
    }

    show() {
        stroke(255);
        strokeWeight(4);
        noFill();
        ellipse(this.x, this.y, 24, 24)
    }
}

/*
game.js:


let bubble1;
let bubble2;

function setup() {
    createCanvas(600, 400);
    bubble1 = new Bubble();
    bubble2 = new Bubble();
}

function draw() {
    background(0);
    bubble1.move();
    bubble1.show();
    bubble2.move();
    bubble2.show();
}



javascript = Java Lite
it really is that easy
but you do have to place a
<script src="scripts/bubble.js"></script>
before you import game.js
*/