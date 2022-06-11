class PointCharge {
    constructor(x, y, charge) {
        this.x = x;
        this.y = y;
        this.q = charge;
        this.constantVoltage = true;
        this.r = Math.abs(12 * (this.q / 0.0005)) + 2
    }

    field(x, y) {
        var distSq = (x - this.x) ** 2 + (y - this.y) ** 2
        var mag = 9e9 * this.q / distSq
        return {x: mag * (x - this.x) / (distSq ** 0.5), y: mag * (y - this.y) / (distSq ** 0.5)};
    }

    voltage(x, y) {
        return 9e9 * this.q / Math.max(((this.x - x) ** 2 + (this.y - y) ** 2) ** 0.5, this.r);
    }

    setVoltageTable(w, h, res) {
        this.voltageTable = [];
        for (var x = 0; x <= w; x += res) {
            var subRray = [];
            for (var y = 0; y <= h; y+= res) {
                subRray.push(this.voltage(x, y));
            }
            this.voltageTable.push(subRray);
        }


        //for weird surfaces where we can't just use a reference table formula
        //field will be a sum of symbolic functions
        //this will also be a sum of the symbolic integral of those functions (much more efficient)
    }

    draw(sketch) {
        //noStroke();
        sketch.stroke(1);
        sketch.strokeWeight(1);
        if (this.q < 0) sketch.fill(122, 122, 255);
        else sketch.fill(255, 122, 122);

        var r = Math.abs(12 * (this.q / 0.0005)) + 2;
        sketch.ellipse(pX(this.x), pY(this.y), sX(r), sY(r));
    }

    checkCollision(pC) {
        return ((this.x - pC.x) ** 2 + (this.y - pC.y) ** 2) ** 0.5 < (pC.r + this.r);
    }
}