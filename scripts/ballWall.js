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
        sketch.ellipse(pX(this.x), pY(this.y), sX(this.r * 2), sY(this.r * 2));
    }

    checkCollision(pC) {
        return ((this.x - pC.x) ** 2 + (this.y - pC.y) ** 2) ** 0.5 < (pC.r + this.r);
    }
}
