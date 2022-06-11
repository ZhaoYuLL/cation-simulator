var levelSelect = document.querySelector("#level-select");
var winScreen = document.querySelector("#win-screen");
var loseScreen = document.querySelector("#lose-screen");
levelSelect.style.display = "block";

gameStatus = "level-select";

// functions for level select buttons
function callLevel(num) {
    levelSelect.style.display = "none";
    gameStatus = "loading";
    loadLevel(num - 1);
}

function win() {
    winScreen.style.display = "block";
    document.querySelector("#music").pause();
    // gameStatus = "win";
}

function lose() {
    //losescreen
    // alert("executed");
    loseScreen.style.display = "block";
    document.querySelector("#music").pause();
}

function restartButton() {
    // document.querySelector('#level-select').style.display = "block";
    // console.log("restart");
    // alert("executed");
    winScreen.style.display = "none";
    loseScreen.style.display = "none";
    levelSelect.style.display = "block";
}
let btn = document.getElementById("restart");
btn.addEventListener('click', event => {
    restartButton();
});
let btn2 = document.getElementById("restart2");
btn2.addEventListener('click', event => {
    restartButton();
});


// pseudo-language
LEVEL_DATA = [
    //level one
    `w=600 h=600 x=300 y=300 cw=600 ch=600 px=300 py=480 pm=0.005 pq=0.005 res=30 th=0
    WB 210 120 50 50
    PC 200 300 0.00025
    PC 400 300 -0.00025`,
    //level two
    `w=600 h=600 x=300 y=300 cw=600 ch=600 px=300 py=480 pm=0.005 pq=0.005 res=30 th=0
    PC 200 300 0.0005
    PC 400 300 -0.00025
    PC 500 300 -0.00025
    PC 400 150 -0.00025
    RW 210 400 50 50
    CN 210 500 10 5
    WB 210 120 50 50`,
    //level three
    `w=1200 h=1200 x=600 y=300 cw=1200 ch=1200 px=600 py=1100 pm=0.005 pq=0.005 res=45 th=0.25
    PC 300 300 0.0005
    PC 900 300 -0.0005
    PC 300 900 -0.0005
    PC 900 900 0.0005
    WB 25 25 50 50`,
    //level four
    `w=1200 h=1200 x=600 y=600 cw=600 ch=600 px=600 py=1100 pm=0.005 pq=0.005 res=45 th=0.25
    PC 300 300 0.0005
    PC 300 400 0.0005
    PC 900 300 -0.0005
    PC 900 400 -0.0005
    PC 300 900 -0.0005
    PC 400 900 -0.0005
    PC 900 900 0.0005
    PC 900 1000 0.0005
    WB 25 25 50 50`
    //level one
    // new Level({w: 600, h: 600}, [
    //     new PointCharge(200, 300, 0.00025),
    //     new PointCharge(400, 300, -0.00025),
    //     new RectWall(210, 400, 50, 50),
    // ]
    //           , new Winbox(210, 120, 50, 50)),
    // {},
    // //level two
    // new Level({w: 600, h: 600}, [
    //     new PointCharge(200, 300, 0.0005),
    //     new PointCharge(400, 300, -0.00025),
    //     new PointCharge(500, 300, -0.00025),
    //     new PointCharge(400, 150, -0.00025),
    // ], new Winbox(210, 120, 50, 50)),
    // {},
];
