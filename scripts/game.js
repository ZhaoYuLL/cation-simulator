var canvasParent = document.getElementById('canvas-container');
var CTX_CAMERA = {x: 500, y: 500, w: 1000, h: 1000, th: 0.25};
var CTX_htmlWIDTH = parseInt(canvasParent.offsetWidth);
var CTX_htmlHEIGHT = parseInt(canvasParent.offsetHeight);
function pX(x) {
    x -= CTX_CAMERA.x;
    x *= CTX_htmlWIDTH / CTX_CAMERA.w;
    x += CTX_htmlWIDTH / 2;
    return x;
}
function pY(y) {
    y -= CTX_CAMERA.y;
    y *= -1;
    y *= CTX_htmlHEIGHT / CTX_CAMERA.h;
    y += CTX_htmlHEIGHT / 2;
    return y;
}
function p(v) {
    return {x: pX(v.x), y: pY(v.y)};
}
function sX(x) {
    return x * CTX_htmlWIDTH / CTX_CAMERA.w;
}
function sY(y) {
    return y * -1 * CTX_htmlHEIGHT / CTX_CAMERA.h;
}
function s(v) {
    return {x: sX(v.x), y: sY(v.y)};
}

let gameStatus;
var fireCharge = false;
let startTime;
let points;
let CTX_playerCharge;
let CTX_level;
const _rgba = (x) => { return x[0] * (256 ** 3) + x[1] * (256 ** 2) + x[2] * 256 + x[3]; };

function updateCanvas(sketch) {
    CTX_htmlWIDTH = parseInt(canvasParent.offsetWidth);
    CTX_htmlHEIGHT = parseInt(canvasParent.offsetHeight);
    sketch.resizeCanvas(CTX_htmlWIDTH, CTX_htmlHEIGHT, false);
}


function loadLevel(n) {
    CTX_level = new Level(LEVEL_DATA[n]);
    // camera should be initalized by level data
    // th * CTX_level.x is the left-most position of PC before the camera pans left
    CTX_CAMERA = {x: CTX_level.x, y: CTX_level.y, w: CTX_level.cw, h: CTX_level.ch, th: CTX_level.th};

    // so should player charge
    const x = CTX_level.px;
    const y = CTX_level.py;
    const mass = CTX_level.pm; //kg
    const charge = CTX_level.pq; //C

    CTX_playerCharge = new PlayerCharge(x, y, mass, charge);
    points = CTX_level.points; //50000;
    startTime = new Date().valueOf();

    document.querySelector("#music").volume = 1;
    //document.querySelector("#music").currentTime = 0;
    document.querySelector("#music").play();
    gameStatus = "playing";

    DRAWEQUIS = true;
    BGRealmSketch.draw();
    ObstacleRealmSketch.draw();
    //PlayerRealmSketch.draw();
}

var BGRealmSketch;
var DRAWEQUIS;
var BGRealm = function(sketch) { // contour lines, information, bg color
    var canvas;
    sketch.setup = function() {
        canvas = sketch.createCanvas(CTX_htmlWIDTH, CTX_htmlHEIGHT);
        canvas.parent('canvas-container');
        sketch.frameRate(30);
        BGRealmSketch = sketch;
    }
    sketch.draw = function() {
        if (gameStatus == "playing") {
            updateCanvas(sketch);
            CTX_level.drawBackground(sketch);
            console.log("something2");
            if (DRAWEQUIS) {
                CTX_level.drawEquis(sketch, 0);
                console.log("something");
                document.querySelector("#equis-img").src = canvas.elt.toDataURL("image/png");
                DRAWEQUIS = false;
            }
            canvas.elt.getContext('2d').drawImage(document.querySelector("#equis-img"), pX(0), pY(CTX_level.h), sX(CTX_level.w), -1 * sY(CTX_level.h));
            //console.log([pX(0), pY(0), pX(CTX_level.w), pY(CTX_level.h)]);
        }
    }
};
new p5(BGRealm);

var ObstacleRealmSketch;
var ObstacleRealm = function(sketch) {  // point charges, coins, rectangular walls, winbox
    var canvas;
    sketch.setup = function() {
        canvas = sketch.createCanvas(CTX_htmlWIDTH, CTX_htmlHEIGHT);
        canvas.parent('canvas-container');
        sketch.frameRate(30);
    }
    sketch.draw = function() {
        if (gameStatus == "playing") {
            updateCanvas(sketch);
            CTX_level.drawObbies(sketch);
            CTX_level.drawBarriers(sketch);
            CTX_level.drawCoins(sketch);
            CTX_level.winbox.draw(sketch);
        }
    }
    ObstacleRealmSketch = sketch;
};
new p5(ObstacleRealm);

var PlayerRealmSketch;
var PlayerRealm = function(sketch) { // player charge, mouse, controls
    var canvas;
    PlayerRealmSketch = sketch;
    sketch.setup = function() {
        canvas = sketch.createCanvas(CTX_htmlWIDTH, CTX_htmlHEIGHT);
        canvas.parent('canvas-container');
        console.log("loaded player realm canv");
        sketch.frameRate(60);
    }
    sketch.draw = function() {
        if (gameStatus == "playing" && CTX_level && CTX_playerCharge) {
            updateCanvas(sketch);

            // then draw the player charge
            CTX_playerCharge.draw(sketch);

            // apply forces
            var coords = CTX_playerCharge;
            if (inControlSpace(sketch.mouseX, sketch.mouseY, CTX_playerCharge)) {
                sketch.fill(0);

                if (!sketch.mouseIsPressed && !fireCharge) {
                    sketch.fill(255, 0, 0);
                    fireCharge = false; //true

                    var dx = sketch.mouseX - pX(coords.x); // on the order of 10
                    var dy = sketch.mouseY - pY(coords.y); // we may need inverse p's and s's for this to work
                    var signX = (sX(dx) > 0) ? 400 : -400;
                    var signY = (sY(dy) > 0) ? 400 : -400;
                    var mass = CTX_playerCharge.m;
                    CTX_playerCharge.applyForce({x: mass * signX, y: mass * signY});
                }

                // draw the "arrow"
                sketch.stroke(0);
                sketch.strokeWeight(3);
                sketch.line(pX(coords.x), pY(coords.y), sketch.mouseX, sketch.mouseY);
            }

            // calculate how long the physics step
            var t = 1 / 150;
            CTX_playerCharge.applyForce(CTX_level.FeAtPoint(coords.x, coords.y, CTX_playerCharge.q));
            CTX_playerCharge.move(t);
            CTX_playerCharge.clearForces();

            var actualPoints = CTX_level.points + parseInt(Math.max(0, SAVE_DATA[currentLevel].maxtime - (new Date().valueOf() - startTime) / 1000)) * 10;
            document.querySelector("#points").innerHTML = "Points: " + actualPoints;
            document.querySelector("#potometer").innerHTML = "+" + CTX_level.VAtPoint(coords.x, coords.y) + "V";
            document.querySelector("#timer").innerHTML = "Time: " + timeNow(startTime);

            var newStatus = CTX_level.checkCollision(CTX_playerCharge);
            if (CTX_level.winbox.inBox(CTX_playerCharge.x, CTX_playerCharge.y) || newStatus == "win") {
                gameStatus = "win";
                CTX_playerCharge = undefined;
                win();
                return;
            }
            if (outBox(CTX_playerCharge.x,CTX_playerCharge.y,CTX_playerCharge.r) || newStatus == "lose") {
                gameStatus = "lose";
                CTX_playerCharge = undefined;
                lose();
                return;
            }
            updateCamera(CTX_playerCharge);
        }
    }
};
new p5(PlayerRealm);

function outBox(x,y,r) {
    return (x + r > CTX_level.w || x - r < 0 || y + r > CTX_level.h || y - r < 0);
}

function inControlSpace(mouseX, mouseY, playerCharge) {
    //return (((mouseX - pX(playerCharge.x)) ** 2 + (mouseY - pY(playerCharge.y)) ** 2) ** 0.5 < sX(100));
    var r = playerCharge.controlRadius;
    var x = pX(playerCharge.x);
    var y = pY(playerCharge.y);
    if (sX(r) < sY(r)) {
        // focii are vertical
        offCenter = (sY(r) ** 2 - sX(r) ** 2) ** 0.5;
        dist1 = (mouseX - x) ** 2 + (mouseY - y - offCenter) ** 2;
        dist2 = (mouseX - x) ** 2 + (mouseY - y + offCenter) ** 2;
        return (dist1 ** 0.5 + dist2 ** 0.5) < (2 * sY(r));
    } else {
        // focii are horizontal
        offCenter = (sX(r) ** 2 - sY(r) ** 2) ** 0.5;
        dist1 = (mouseX - x - offCenter) ** 2 + (mouseY - y) ** 2;
        dist2 = (mouseX - x + offCenter) ** 2 + (mouseY - y) ** 2;
        return (dist1 ** 0.5 + dist2 ** 0.5) < (2 * sX(r));
    }
}

function timeNow(t_0) {
    dt = (new Date().valueOf() - t_0) / 1000;
    hr = parseInt(dt / 3600);
    mn = parseInt((dt % 3600) / 60);
    sc = dt % 60;
    return ("" + hr).padStart(2, "0") + ":" + ("" + mn).padStart(2, "0") + ":" + ("" + sc.toFixed(3)).padStart(6, "0");
}

function updateCamera(pC) {
    if (pC.x < CTX_CAMERA.x + CTX_CAMERA.w * (CTX_CAMERA.th - 0.5)) //pan left
        CTX_CAMERA.x = Math.max(CTX_CAMERA.w * 0.5, pC.x + (0.5 - CTX_CAMERA.th) * CTX_CAMERA.w);

    if (pC.x > CTX_CAMERA.x - CTX_CAMERA.w * (CTX_CAMERA.th - 0.5)) //pan right
        CTX_CAMERA.x = Math.min(CTX_level.w - CTX_CAMERA.w * 0.5, pC.x - (0.5 - CTX_CAMERA.th) * CTX_CAMERA.w);

    if (pC.y < CTX_CAMERA.y + CTX_CAMERA.h * (CTX_CAMERA.th - 0.5)) //pan up
        CTX_CAMERA.y = Math.max(CTX_CAMERA.h * 0.5, pC.y + (0.5 - CTX_CAMERA.th) * CTX_CAMERA.h);

    if (pC.y > CTX_CAMERA.y - CTX_CAMERA.h * (CTX_CAMERA.th - 0.5)) //pan down
        CTX_CAMERA.y = Math.min(CTX_level.h - CTX_CAMERA.h * 0.5, pC.y - (0.5 - CTX_CAMERA.th) * CTX_CAMERA.h);
}
