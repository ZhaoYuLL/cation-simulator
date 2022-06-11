class PolyWall {
    constructor(verts){
        this.verts = verts;
        this.verts.push(verts[0]);
        this.trs = [];
        var dx, dy;
        for (var i = 0; i < this.verts.length - 1; i++) {
            dx = this.verts[i+1].x - this.verts[i].x;
            dy = this.verts[i+1].y - this.verts[i].y;
            this.trs.push(new TiltRectWall(this.verts[i].x, this.verts[i].y,
                                           (dx ** 2 + dy ** 2) ** 0.5, 1,
                                           Math.atan2(dy, dx)));
        }
        this.shape = "poly";
    }

    draw(sketch){
        sketch.stroke(1);
        sketch.strokeWeight(1);
        sketch.fill(1,1,1);
        sketch.beginShape();
        for (var i = 0; i < this.verts.length; i++) {
            sketch.vertex(pX(this.verts[i].x), pY(this.verts[i].y));
        }
        sketch.endShape(sketch.CLOSE);
    }

    checkCollision(pC) {
        var colliding = false;
        for (var i = 0; i < this.trs.length; i++)
            colliding = colliding || this.trs[i].checkCollision(pC);
        return colliding;
    }
}