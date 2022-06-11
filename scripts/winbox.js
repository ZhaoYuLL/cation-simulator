class Winbox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    inBox(x, y) {
        return ((x > this.x - this.w/2) && (x < this.x + this.w/2)) &&
               ((y > this.y - this.h/2) && (y < this.y + this.h/2));
    }

    draw(sketch) {
        sketch.noStroke();
        sketch.fill(0, 255, 0);
        sketch.rect(pX(this.x - this.w/2), pY(this.y - this.h/2), sX(this.w), sY(this.h));
    }
}