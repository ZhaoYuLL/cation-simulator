class Level {
    constructor(data) {
        var PF = parseFloat;

        var lines = data.split("\n");
        var settings = lines[0].split(/\s+/);
        for (var i = 0; i < settings.length; i++) { // w h x y px py pm pq
            var key = settings[i].split("=")[0];
            var value = settings[i].split("=")[1];
            this[key] = PF(value);
        }
        this.obbies = [];
        this.barriers = [];
        this.coins = []
        this.winbox = undefined;
        this.points = 0;
        this.coinsCnt = 0;
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].trim();
            var key = line.split(/\s+/)[0];
            var args = line.split(/\s+/).slice(1);
            switch (key) {
                case "PC":
                    this.obbies.push(new PointCharge(PF(args[0]), PF(args[1]), PF(args[2])));
                    break;
                case "WB":
                    this.winbox = new Winbox(PF(args[0]), PF(args[1]), PF(args[2]), PF(args[3]));
                    break;
                case "RW":
                    this.barriers.push(new RectWall(PF(args[0]), PF(args[1]), PF(args[2]), PF(args[3])));
                    break;
                case "TW":
                    this.barriers.push(new TiltRectWall(PF(args[0]), PF(args[1]), PF(args[2]), PF(args[3]), PF(args[4])));
                    break;
                case "PW":
                    verts = [];
                    for (var i = 0; i < args.length; i += 2) {
                        verts.push({x: args[i], y: args[i+1]});
                    }
                    this.barriers.push(new PolyWall(verts));
                    break;
                case "CN":
                    this.coins.push(new Coin(PF(args[0]), PF(args[1]), PF(args[2]), PF(args[3])));
                    break;
            }
        }

        // create constant voltages table
        this.const_voltageTable = [];
        var res = this.res;
        var obbies = this.obbies;
        for (var x = 0; x < this.w; x += res) {
            var subRray = [];
            for (var y = 0; y < this.h; y += res) {
                subRray.push(0);
            }
            this.const_voltageTable.push(subRray);
        }

        for (var i = 0; i < obbies.length; i++) {
            obbies[i].setVoltageTable(this.w, this.h, res);
            if (obbies[i].constantVoltage) {
                for (var j = 0; j < this.const_voltageTable.length; j++)
                    for (var k = 0; k < this.const_voltageTable[j].length; k++)
                        this.const_voltageTable[j][k] += obbies[i].voltageTable[j][k];
            }
        }
    }

    FeAtPoint(x, y, q) {
        var sumF = {x: 0, y: 0};
        for (var i = 0; i < this.obbies.length; i++) {
            var F = this.obbies[i].field(x, y);
            sumF.x += F.x;
            sumF.y += F.y;
        }
        sumF.x *= q;
        sumF.y *= q;
        return sumF;
    }

    VAtPoint(x, y) {
        var sumV = 0;
        for (var i = 0; i < this.obbies.length; i++) sumV += this.obbies[i].voltage(x, y);
        return sumV;
    }

    FmAtPoint(x, y, v, q) {

    }

    drawBezier(sketch, p0, p1) {
        var dist = ((p0.x - p1.x) ** 2 + (p0.y - p1.y) ** 2) ** 0.5;
        var field0 = this.FeAtPoint(p0.x, p0.y, 1);
        var field1 = this.FeAtPoint(p1.x, p1.y, 1);
        var slope0 = {x: -1 * field0.y, y: field0.x};
        var slope1 = {x: -1 * field1.y, y: field1.x};
        var o0 = Math.atan2(slope0.y - p0.y, slope0.x - p0.x);
        var o1 = Math.atan2(slope1.y - p1.y, slope1.x - p1.x);
        var o_to = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        var o_fro = Math.atan2(p0.y - p1.y, p0.x - p1.x);
        if (Math.abs(o0 - o_to) > 3.14159265358979323846/2) {
            slope0.x *= -1;
            slope0.y *= -1;
        }
        if (Math.abs(o1 - o_fro) > 3.14159265358979323846/2) {
            slope1.x *= -1;
            slope1.y *= -1;
        }
        var mag0 = ((slope0.x) ** 2 + (slope0.y) ** 2) ** 0.5;
        var mag1 = ((slope1.x) ** 2 + (slope1.y) ** 2) ** 0.5;
        slope0.x *= dist / mag0;
        slope0.y *= dist / mag0;
        slope1.x *= dist / mag1;
        slope1.y *= dist / mag1;

        function pX(x) {
            x -= CTX_level.w / 2;
            x *= CTX_htmlWIDTH / CTX_level.w;
            x += CTX_htmlWIDTH / 2;
            return x;
        }
        function pY(y) {
            y -= CTX_level.h / 2;
            y *= -1;
            y *= CTX_htmlHEIGHT / CTX_level.h;
            y += CTX_htmlHEIGHT / 2;
            return y;
        }
        function p(v) {
            return {x: pX(v.x), y: pY(v.y)};
        }
        function sX(x) {
            return x * CTX_htmlWIDTH / CTX_level.w;
        }
        function sY(y) {
            return y * -1 * CTX_htmlHEIGHT / CTX_level.h;
        }
        function s(v) {
            return {x: sX(v.x), y: sY(v.y)};
        }

        p0 = p(p0);
        p1 = p(p1);
        slope0 = s(slope0);
        slope1 = s(slope1);
        sketch.bezier(p0.x, p0.y, p0.x + slope0.x, p0.y + slope0.y, p1.x + slope1.x, p1.y + slope1.y, p1.x, p1.y);
        //sketch.line(pX(p0.x), pY(p0.y), pX(p1.x), pY(p1.y));
        //console.log("bezier");
    }

    drawEquis(sketch, t) {
        var res = this.res;

        var table = [];
        for (var i = 0; i < this.const_voltageTable.length; i++) {
            table.push(this.const_voltageTable[i].slice())
            for (var h = 0; h < this.obbies.length; h++) {
                if (!this.obbies[h].constantVoltage) {
                    for (var j = 0; j < table[i].length; j++) {
                        table[i][j] += this.obbies[i].voltageTable[i][j] * this.obbies[h].factor(t);
                    }
                }
            }
        }
        var min, max; // goes from 122, 255, 255 to 255, 255, 122, 10 lines
        if (this.minV && this.maxV) {
            min = this.minV;
            max = this.maxV;
        } else {
            min = table[0][0];
            max = table[0][0];
            for (var i = 0; i < table.length; i++) {
                for (var j = 0; j < table[i].length; j++) {
                    min = Math.min(table[i][j], min);
                    max = Math.max(table[i][j], max);
                }
            }
            min = (!this.dmin) ? min : Math.max(this.dmin, min);
            max = (!this.dmax) ? max : Math.min(this.dmax, max);
        }

        var voltages = {};
        console.log(min);
        console.log(max);
        // iterate horizontally, vertically, diagonally, diagonally, and store the midpoints where the voltage line goes through
        for (var dv = 0.05; dv <= 0.95; dv += 0.1) {
            var ndv = 0.5 + (dv - 0.5) ** 5;
            var voltage = (1-ndv) * min + ndv * max; // start at min, go up really fast to (min+max)/2, then go to max
            console.log(voltage);
            voltages[voltage] = [];
            for (var i = 0; i < table.length; i++)
                for (var j = 0; j < table.length - 1; j++)
                    if ((table[i][j] - voltage) * (table[i][j + 1] - voltage) < 1) {
                        var p = (table[i][j] - voltage) / (table[i][j] - table[i][j + 1]);
                        voltages[voltage].push({x: i * res, y: (j + p) * res});
                        // here voltages could  be calculated again and again to further binary search a few rounds
                    }
            for (var j = 0; j < table.length; j++)
                for (var i = 0; i < table.length - 1; i++)
                    if ((table[i][j] - voltage) * (table[i + 1][j] - voltage) < 1) {
                        var p = (table[i][j] - voltage) / (table[i][j] - table[i + 1][j]);
                        voltages[voltage].push({x: (i + p) * res, y: j * res});
                    }
            for (var u = 0; u < 2 * table.length - 1; u++) { // this isn't spaghetti, this is compak , goes from 0 to 4 (1-5)
                var num = table.length - 1 - Math.abs(table.length - u - 1); // goes from 0 to 2 to 0 (1-3)
                var i = Math.max(0, u + 1 - table.length); //startX, to go down-right
                var j = Math.max(0, table.length - u - 1); //startY
                for (var v = 0; v < num; v++) { // number of steps
                    if ((table[i][j] - voltage) * (table[i + 1][j + 1] - voltage) < 1) {
                        var p = (table[i][j] - voltage) / (table[i][j] - table[i + 1][j + 1]);
                        voltages[voltage].push({x: (i + p) * res, y: (j + p) * res});
                    }
                    i++;
                    j++;
                }
                var i = Math.max(0, table.length - u - 1); //to go up-right
                var j = Math.min(table.length - 1, 2 * (table.length - 1) - u);
                for (var v = 0; v < num; v++) { // number of steps
                    if ((table[i][j] - voltage) * (table[i + 1][j - 1] - voltage) < 1) {
                        var p = (table[i][j] - voltage) / (table[i][j] - table[i + 1][j - 1]);
                        voltages[voltage].push({x: (i + p) * res, y: (j - p) * res});
                    }
                    i++;
                    j--;
                }
            }

            sketch.noFill();
            sketch.strokeWeight(sX(1));
            sketch.stroke(255 - dv * 122, 255, 122 + dv * 122);
            var points = voltages[voltage];
            var cycles = [];
            var cycle = [];
            var closestDistanceVal = res * 6;
            while (points.length > 0) {
                var startPoint = points[0];
                //console.log(startPoint);
                if (cycle.length == 0) cycle.push(startPoint);

                var closestPoint = null;
                var closestDistance = closestDistanceVal;
                var closestIndex = -1;
                for (var i = 1; i < points.length; i++) {
                    if (((points[i].x - startPoint.x) ** 2 + (points[i].y - startPoint.y) ** 2) < closestDistance ** 2) {
                        closestPoint = points[i];
                        closestDistance = (points[i].x - startPoint.x) ** 2 + (points[i].y - startPoint.y) ** 2;
                        closestDistance **= 0.5;
                        closestIndex = i;
                    }
                }
                if (!closestPoint) {
                    points.splice(0, 1);
                    cycles.push(cycle);
                    cycle = [];
                    continue;
                }

                this.drawBezier(sketch, startPoint, closestPoint);

                cycle.push(closestPoint);
                points[0] = points[closestIndex];
                points.splice(closestIndex, 1);
            }
            for (var i = 0; i < cycles.length; i++) {
                if (cycles[i].length < 2) continue;
                if (((cycles[i][cycles[i].length - 1].x - cycles[i][0].x) ** 2 + (cycles[i][cycles[i].length - 1].y - cycles[i][0].y) ** 2) < closestDistanceVal) this.drawBezier(sketch, cycles[i][cycles[i].length - 1], cycles[i][0]);
            }
        }


        // to render the voltage lines, iterate through voltages, pick a point, travel along the neighboring points
            // append the points to an array, then remove the points from the voltage's list
            // render the polygon for as long as you can go
            // if we want to turn into a smooth curve, we recognize that the slope through that point must be
            // perpendicular to field at that point
            // we also know what the slope must be through the next point
            // we will then take the control points to both be where the two slopes, and draw a bezier curve
            // alternatively the control points can be the same distance away from point1 as point2 is and same for point2

    }

    drawMagns(sketch, pC) {
        // also magnetic fields can be a funny zig-zag texture that's skewed into a triangle shape
            // through the magic of P5 linear algebra
    }

    drawObbies(sketch) {
        for (var i = 0; i < this.obbies.length; i++)
            this.obbies[i].draw(sketch);
    }
    drawBarriers(sketch) {
        for (var i = 0; i < this.barriers.length; i++){
            this.barriers[i].draw(sketch);
        }
    }
    drawCoins(sketch) {
        for (var i = 0; i < this.coins.length; i ++){
            this.coins[i].draw(sketch);
        }
    }

    drawBackground(sketch) {
        sketch.background(130, 122, 172);
    }

    checkCollision(pC) {
        for (var i = 0; i < this.obbies.length; i++) {
            if (this.obbies[i].checkCollision(pC)) return "lose";
        }
        for (var i = 0; i < this.barriers.length; i++) {
            if (this.barriers[i].checkCollision(pC)) return "lose";
        }
        for (var i = 0; i < this.coins.length; i++) {
            if (this.coins[i].checkCollision(pC)){
                //add points
                this.points += this.coins[i].p;
                this.coinsCnt++;
                this.coins.splice(i,1)
                i--;
            }
        }
        if (this.winbox.inBox(pC.x, pC.y)) return "win";
        return "keep playing";
        // return "lose" ,"win", "keep playing"
    }

}
