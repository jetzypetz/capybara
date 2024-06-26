"use strict";

//leaderboard
let leaderboard_raw = sessionStorage.getItem("leaderboard") || "[]"
let leaderboard = JSON.parse(leaderboard_raw)
redraw_leaderboard(leaderboard)

//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//capy
let capyWidth = 80;
let capyHeight = 50;
let capyDuckingHeight = 40;
let capyX = 50;
let capyStandingY = boardHeight - capyHeight;
let capyDuckingY = boardHeight - capyDuckingHeight;
let capyY = capyStandingY;
let ducking = false;

let capyStanding = new Image();
capyStanding.src = "./img/classiccapystanding.png";
capyStanding.onload;

let capyRunning = new Image();
capyRunning.src = "./img/classiccapyrunning.png";
capyRunning.onload;

let capyDucking = new Image();
capyDucking.src = "./img/classiccapyducking.png";
capyDucking.onload;

let capyDead = new Image();
capyDead.src = "./img/classiccapydead.png";
capyDead.onload;

let capyImg = capyStanding;

let capy = {
    x : capyX,
    y : capyY,
    width : capyWidth,
    height : capyHeight
}

//book
let bookArray = [];
let book;

let book1Width = 45;
let book2Width = 60;
let book3Width = 80;

let bookHeight = 50;
let bookX = 800;
let bookY = boardHeight - bookHeight;

//pen
let penWidth = 50;
let penHeight = bookHeight;
let penX = 800;
let penY = boardHeight - penHeight -40;
let penImg = new Image();
penImg.src = "./img/pen.png";
penImg.onload;

let book1Img = new Image();
book1Img.src = "./img/book1.png";
book1Img.onload;

let book2Img = new Image();
book2Img.src = "./img/book1.png";
book2Img.onload;

let book3Img = new Image();
book3Img.src = "./img/book1.png";
book3Img.onload;

//the physics
let velocityX = -4.5; // obstacles moving left speed
let velocityY = 0;
let gravity = .32;
let running = false;

let gameOver = false;
let startagain = false;
let score = 0;
let highScore = -1;

let darkModeTimeout;

let gameovertext = document.createElement("div");
gameovertext.textContent = 'GAME OVER';
gameovertext.classList.add("gameover");
gameovertext.style.display = 'none'; 
document.body.appendChild(gameovertext);

// Game button image element
let newGameButton = document.createElement("img");
newGameButton.src = "img/reset.png"; 
newGameButton.classList.add("new-game-button");
newGameButton.style.display = 'none'; 
document.body.appendChild(newGameButton);

newGameButton.addEventListener("click", function() {
    startagain = true;
});

// costumes buttons

function classic() {
    capyStanding.src = "./img/classiccapystanding.png";
    capyStanding.onload;

    capyRunning.src = "./img/classiccapyrunning.png";
    capyRunning.onload;

    capyDucking.src = "./img/classiccapyducking.png";
    capyDucking.onload;

    capyDead.src = "./img/classiccapydead.png";
    capyDead.onload;
};

function princess() {
    capyStanding.src = "./img/princesscapystanding.png";
    capyStanding.onload;

    capyRunning.src = "./img/princesscapyrunning.png";
    capyRunning.onload;

    capyDucking.src = "./img/princesscapyducking.png";
    capyDucking.onload;
    
    capyDead.src = "./img/princesscapydead.png";
    capyDead.onload;
};

function cs() {
    capyStanding.src = "./img/cscapystanding.png";
    capyStanding.onload;
    
    capyRunning.src = "./img/cscapyrunning.png";
    capyRunning.onload;

    capyDucking.src = "./img/cscapyducking.png";
    capyDucking.onload;

    capyDead.src = "./img/cscapydead.png";
    capyDead.onload;
};

function fancy() {
    capyStanding.src = "./img/fancycapystanding.png";
    capyStanding.onload;

    capyRunning.src = "./img/fancycapyrunning.png";
    capyRunning.onload;

    capyDucking.src = "./img/fancycapyducking.png";
    capyDucking.onload;

    capyDead.src = "./img/fancycapydead.png";
    capyDead.onload;
};

//game starter, all initialization here
function startgame() {
    document.body.style.backgroundColor = "#FFF";
    document.body.classList.remove("dark-mode"); // Ensure dark mode class removed
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    context.drawImage(capyStanding, capy.x, capy.y, capy.width, capy.height);

    requestAnimationFrame(update);
    setInterval(placebook, 1000); // 1000 milliseconds = 1 second
    document.addEventListener("keydown", movecapy);
    document.addEventListener("keyup", stop_ducking);

    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.play();
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        if (startagain) {
            capyImg = capyStanding;
            capy.height = capyHeight;
            capyY = capyStandingY;
            velocityX = -4.5;
            bookArray = [];

            score = 0;
            gameOver = false;
            startagain = false;
            gameovertext.style.display = 'none'; 
            newGameButton.style.display = 'none';
            document.body.style.backgroundColor = "#FFF"; // Reset to daytime (white)
            document.body.classList.remove("dark-mode"); 
        }
        return;
    }
    if (score % 7 == 0) {
        running = !running;
    }

    if (ducking) {
        capyImg = capyDucking;
        capy.height = capyDuckingHeight;
        capyY = capyDuckingY;
    } else {
        capy.height = capyHeight;
        capyY = capyStandingY;
        if (!running && capy.y == capyY) {
            capyImg = capyStanding;
        } else {
            capyImg = capyRunning;
        }
    }

    context.clearRect(0, 0, board.width, board.height);

    // capy
    velocityY += gravity;
    capy.y = Math.min(capy.y + velocityY, capyY); // apply gravity to current capy.y, making sure it doesn't exceed the ground

    // books
    for (let i = 0; i < bookArray.length; i++) {
        let book = bookArray[i];
        book.x += velocityX;
        context.drawImage(book.img, book.x, book.y, book.width, book.height);
    }

    detectCollision();

    if (gameOver) {

        let leaderRaw = sessionStorage.getItem("leaderboard")

        let leaderboard = []
        if(leaderRaw != null && leaderRaw.length > 0) {
            leaderboard = JSON.parse(leaderRaw)
        }

        let playerName = document.getElementById("playerName").value

        if (playerName.length > 0) { // Add score to leaderboard
            leaderboard.push([playerName, score+1])
            leaderboard.sort((a, b) => { 
                return a[1] > b[1] ? 1 : -1;
            });
            console.log(leaderboard)
            sessionStorage.setItem("leaderboard", JSON.stringify(leaderboard))

            redraw_leaderboard(leaderboard)
        }



        capyImg = capyDead;
        gameovertext.style.display = 'block'; 
        newGameButton.style.display = 'block'; 
        clearTimeout(darkModeTimeout); // Clear the dark mode timer

        if (score > highScore) {
            highScore = score;  // Update high score
        }
    }
    context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);

    // speed up (adjusted)
    velocityX -= 0.0045

    // score
        context.fillStyle = "black";
        context.font = "20px courier";
        score++;
        context.fillText(score, board.width - 65, 25);
        context.fillText("HI " + (highScore + 1), board.width - 160, 25);
}

function redraw_leaderboard(leaderboard) {

    let elem = document.getElementById("leaderboardcell_template")
    
    // Remove everything from current leaderboard
    document.getElementById("leaderboard_wrapper").innerHTML = ""

    for(let i=leaderboard.length-1;i>0;i--) {
        if(leaderboard.length-i>10)
            break

        let name = leaderboard[i][0]
        let score = leaderboard[i][1]
        
        let copy = elem.cloneNode(true)

        copy.querySelector(".leaderboard_name").innerHTML = name
        copy.querySelector(".leaderboard_score").innerHTML = score
        
        document.getElementById("leaderboard_wrapper").appendChild(copy)
    }


}

function movecapy(e) {
    if (gameOver) {
        startagain = true;
    }
    
    if ((e.code == "Space" || e.code == "ArrowUp") && capy.y == capyY) {
        //jump
        velocityY = -8;
    }
    else if (e.code == "ArrowDown") {
        gravity = .6;
        if (capy.y == capyY) {
            ducking = true;
        }
    }
    
}

function stop_ducking() {
    ducking = false;
    gravity = .32;
}

function placebook() {
    if (gameOver) {
        return;
    }
    
    //place book
    let book = {
        img : null,
        x : bookX,
        y : bookY,
        width : null,
        height: bookHeight
    }
    
    let placebookChance = Math.random(); //0 - 0.9999...
    
    if (placebookChance > .90) {
        book.img = penImg;
        book.width = penWidth;
        book.y = penY;
        book.height= penHeight;
        bookArray.push(book);
    }
    else if (placebookChance > .80) { //10% you get book3
        book.img = book3Img;
        book.width = book3Width;
        bookArray.push(book);
    }
    else if (placebookChance > .70) { //30% you get book2
        book.img = book2Img;
        book.width = book2Width;
        bookArray.push(book);
    }
    else if (placebookChance > .40) { //40% you get book1
        book.img = book1Img;
        book.width = book1Width;
        bookArray.push(book);
    }
    
    if (bookArray.length > 5) {
        bookArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision() {
    for (let i = 0; i < bookArray.length; i++) {
        let book = bookArray[i];
        
        // Define precise bounding boxes for the books (adjusted)
        let bookBoundingBox = {
            x: book.x + 10, 
            y: book.y + 10,
            width: book.width - 20,
            height: book.height - 10
        };
        
        if (capy.x < bookBoundingBox.x + bookBoundingBox.width &&   // 1 top left corner doesn't reach 2 top right corner
            capy.x + capy.width > bookBoundingBox.x &&   // 1 top right corner passes 2 top left corner
            capy.y < bookBoundingBox.y + bookBoundingBox.height &&  // 1 top left corner doesn't reach 2 bottom left corner
            capy.y + capy.height > bookBoundingBox.y) {  // 1 bottom left corner passes 2 top left corner
            gameOver = true;
            if (score > highScore) {
                highScore = score;
            }
        }
    }
}
  
window.onload = function() {
    startgame();
    backgroundMusic.play();

    const musicControlButton = document.getElementById('musicControl');
    musicControlButton.addEventListener('click', function() {
        const backgroundMusic = document.getElementById('backgroundMusic');
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicControlButton.textContent = 'Pause Music';
        }
        else {
            backgroundMusic.pause();
            musicControlButton.textContent = 'Play Music';
        }

    });
};

// Toggle background music play/pause
function toggleMusic() {
    if (backgroundMusic.paused) {
        playMusic();
        musicControlButton.textContent = 'Pause Music';
    } else {
        pauseMusic();
        musicControlButton.textContent = 'Play Music';
    }
}

function toggleDarkMode() {
    let body = document.body;
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        body.style.backgroundColor = "#FFF"; 
    } else {
        body.classList.add("dark-mode");
        body.style.backgroundColor = "#333"; 
    }
}

setTimeout(toggleDarkMode, 40000); 
