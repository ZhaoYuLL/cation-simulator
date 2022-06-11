// PlayerCharge object is initialized once every level
class PlayerCharge {
    constructor(x, y, mass, charge) {
        this.x = x;
        this.y = y;
        this.r = 12;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.m = mass;
        this.q = charge;
        this.controlRadius = 100;
    }

    applyForce(F) {
        this.ax += F.x / this.m;
        this.ay += F.y / this.m;
    }

    clearForces() {
        this.ax = 0;
        this.ay = 0;
    }

    move(t) {
        this.vx += t * this.ax;
        this.vy += t * this.ay;
        this.x += this.vx * t + 0.5 * this.ax * (t * t);
        this.y += this.vy * t + 0.5 * this.ay * (t * t);
        document.querySelector("#info p").innerHTML = "Accel: " +((this.ax ** 2 + this.ay ** 2) **     0.5).toFixed(2);
    }

    checkColors(color){
        
    }
    draw(sketch) {
        sketch.noStroke();
        sketch.stroke(0);
        sketch.strokeWeight(5);
        if(this.q > 0) sketch.fill(255, 122, 122);
        else sketch.fill(122, 122, 255);
        
        sketch.ellipse(pX(this.x), pY(this.y), sX(24), sY(24));

        sketch.fill(200, 200, 200, 0.2);
        sketch.stroke(0, 0, 0, 0.5)
        sketch.ellipse(pX(this.x), pY(this.y), sX(this.controlRadius * 2), sY(this.controlRadius * 2));
        
        // document.querySelector("#info p").innerHTML = "Acceleration: " +((this.ax ** 2 + this.ay ** 2) **     0.5).toFixed(2);
        // console.log(((this.ax ** 2 + this.ay ** 2) **0.5).toFixed(2));
        document.querySelector("#charge p").innerHTML = "Charge: " + this.q;
    }
}
