class TiltRectWall {
    constructor(x,y,w,h,o){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.o = o; // angle is from horizontal, rotated about (x, y), degrees
        this.c = Math.cos(3.14159265358979323846 / 180 * this.o);
        this.s = Math.sin(3.14159265358979323846 / 180 * this.o);
        this.shape = "tiltRect";
    }

    draw(sketch){
        sketch.stroke(1);
        sketch.strokeWeight(1);
        sketch.fill(1,1,1);
        var x = this.x;
        var y = this.y;
        sketch.beginShape();
        sketch.vertex(pX(x), pY(y));
        x += this.w * this.c
        y += this.w * this.s
        sketch.vertex(pX(x), pY(y));
        x += this.h * this.s
        y -= this.h * this.c
        sketch.vertex(pX(x), pY(y));
        x -= this.w * this.c
        y -= this.w * this.s
        sketch.vertex(pX(x), pY(y));
        sketch.endShape(sketch.CLOSE);
    }

    checkCollision(pC) {
        var x = pC.x - this.x;
        var y = pC.y - this.y;
        var x2 = (this.c * x + this.s * y) + this.x;
        var y2 = (this.c * y - this.s * x) + this.y;
        return (pC.x - pC.r < x2 + this.w) && (pC.x + pC.r > x2) && (pC.y - pC.r < y2 + this.h) && (pC.y + pC.r > y2);
    }
}
