class BallWall {
    constructor(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;
        this.m = r * 0.1;
    }

    draw(sketch){
        sketch.noStroke();
        sketch.fill(1);
        sketch.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    checkCollision(pC) {
        return ((this.x - pC.x) ** 2 + (this.y - pC.y) ** 2) ** 0.5 < (pC.r + this.r);
    }
}