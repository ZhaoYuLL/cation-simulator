var levelSelect = document.querySelector("#level-select");
var winScreen = document.querySelector("#win-screen");
var loseScreen = document.querySelector("#lose-screen");
var currentLevel;

levelSelect.style.display = "block";

gameStatus = "level-select";

// functions for level select buttons
function callLevel(num) {
    if (SAVE_DATA[num - 1] && !SAVE_DATA[num - 1].completed) return;
    levelSelect.style.display = "none";
    winScreen.style.display = "none";
    loseScreen.style.display = "none";
    gameStatus = "loading";
    loadLevel(num);
    currentLevel = num;
}

function win() {
    document.querySelector("#coins-end").innerHTML = "Coins: " + CTX_level.coinsCnt;
    var timePoints = Math.max(0, SAVE_DATA[currentLevel].maxtime - (new Date().valueOf() - startTime) / 1000);
    var accPoints = CTX_level.points + parseInt(timePoints) * 10;
    document.querySelector("#points-end").innerHTML = "Points: " + accPoints;
    SAVE_DATA[currentLevel].highscore = Math.max(SAVE_DATA[currentLevel].highscore, accPoints)
    document.querySelector("#highscore-end").innerHTML = "Highscore: " + SAVE_DATA[currentLevel].highscore;
    document.querySelector("#time-end").innerHTML = document.querySelector("#timer").innerHTML;

    winScreen.style.display = "block";
    document.querySelector("#music").pause();
    SAVE_DATA[currentLevel].completed = true;
    var nextLevelBtn = document.querySelector("#next-level");
    if (SAVE_DATA[currentLevel].completed && currentLevel + 1 < 10) nextLevelBtn.style.display = "inline-block";
    else nextLevelBtn.style.display = "none";

    nextLevelBtn.setAttribute("onclick", "callLevel(" + (currentLevel + 1) + ")");

    var levelElem = document.getElementsByClassName("level")[currentLevel + 1];
    if (levelElem) levelElem.classList.remove("level-disabled");
}

function lose() {
    document.querySelector("#coins-end2").innerHTML = "Coins: " + CTX_level.coinsCnt;
    var timePoints = Math.max(0, SAVE_DATA[currentLevel].maxtime - (new Date().valueOf() - startTime) / 1000);
    var accPoints = CTX_level.points + parseInt(timePoints) * 10;
    document.querySelector("#points-end2").innerHTML = "Points: " + accPoints;
    SAVE_DATA[currentLevel].highscore = Math.max(SAVE_DATA[currentLevel].highscore, accPoints)
    document.querySelector("#highscore-end2").innerHTML = "Highscore: " + SAVE_DATA[currentLevel].highscore;
    document.querySelector("#time-end2").innerHTML = document.querySelector("#timer").innerHTML;
    //losescreen
    // alert("executed");
    loseScreen.style.display = "block";
    document.querySelector("#music").pause();
    var nextLevelBtn = document.querySelector("#next-level2");
    if (SAVE_DATA[currentLevel].completed && currentLevel + 1 < 10) nextLevelBtn.style.display = "inline-block";
    else nextLevelBtn.style.display = "none";

    nextLevelBtn.setAttribute("onclick", "callLevel(" + (currentLevel + 1) + ")");
}

function restartButton() {
    // document.querySelector('#level-select').style.display = "block";
    // console.log("restart");
    // alert("executed");
    winScreen.style.display = "none";
    loseScreen.style.display = "none";
    callLevel(currentLevel + 1);
}
let btn = document.getElementById("restart");
btn.addEventListener('click', event => {
    restartButton();
});
let btn2 = document.getElementById("restart2");
btn2.addEventListener('click', event => {
    restartButton();
});
document.addEventListener("keyup", function(event) {
    if (event.key === 'r' || event.key === 'R') {
        restartButton();
    }
});

function selectLevel() {
    // document.querySelector('#level-select').style.display = "block";
    // console.log("restart");
    // alert("executed");
    winScreen.style.display = "none";
    loseScreen.style.display = "none";
    levelSelect.style.display = "block";
}


btn = document.getElementById("select-level");
btn.addEventListener('click', event => {
    selectLevel();
});
btn2 = document.getElementById("select-level2");
btn2.addEventListener('click', event => {
    selectLevel();
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

SAVE_DATA = [
    //1
    {completed: false,
    highscore: 0,
    maxtime: 120},
    //2
    {completed: false,
    highscore: 0,
    maxtime: 120},
    //3
    {completed: false,
    highscore: 0,
    maxtime: 120},
    //4
    {completed: false,
    highscore: 0,
    maxtime: 120},
    //5
    {completed: false,
    highscore: 0,
    maxtime: 120},
    //6
    {completed: false,
    highscore: 0,
    maxtime: 120},
    //7
    {completed: false,
    highscore: 0,
    maxtime: 120},
    //8
    {completed: false,
    highscore: 0,
    maxtime: 120},
    //9
    {completed: false,
    highscore: 0,
    maxtime: 120},
    //10
    {completed: false,
    highscore: 0,
    maxtime: 120},
];
