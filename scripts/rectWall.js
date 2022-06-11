class RectWall {
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.shape = "rect";
    }

    draw(sketch){   
        sketch.stroke(1);
        sketch.strokeWeight(1);
        sketch.fill(1,1,1);
        sketch.rect(pX(this.x),pY(this.y),sX(this.w),sY(this.h));
    }

    checkCollision(pC) {
        return (pC.x - pC.r < this.x + this.w) && (pC.x + pC.r > this.x) && (pC.y - pC.r < this.y + this.h) && (pC.y + pC.r > this.y);
    }
}