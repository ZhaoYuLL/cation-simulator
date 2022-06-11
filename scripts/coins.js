class Coin {
    constructor(x,y,r,points){
        this.x = x;
        this.y = y;
        this.r = r;
        this.p = points;
        this.show = true;
    }

    draw(sketch) {
        if (!this.show) return;
        sketch.stroke(0);
        sketch.strokeWeight(1);
        sketch.fill(255,255,0);
        
        // var photo = loadImage("../favicon.ico");
        // var maskImage = createGraphics(512,512);
        // maskImage.ellipse(pX(this.x),pY(this.y),sX(this.r));
        // photo.mask(maskImage);
        // image(photo,pX(this.x),pY(this.y));
        sketch.ellipse(pX(this.x),pY(this.y),sX(this.r));
    }

    //array of coins
    //if the the player charge is inside one of the coins, remove point, add the points from the coin to the counter
    //e.g: if coin.contains(playercharge) instead of player charge is in a coin if that makes sense
    
    checkPoint (x, y) {
        return ((x - this.x) ** 2 + (y - this.y) ** 2) < this.r ** 2;
    }

    checkCollision(pC) {
        return ((this.x - pC.x) ** 2 + (this.y - pC.y) ** 2) ** 0.5 < (pC.r + this.r);
    }
}