"use strict";

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

let book1Img;
let book2Img;
let book3Img;

//physics
let velocityX = -4.5; // book moving left speed
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
gameovertext.style.display = 'none'; // Hide initially
document.body.appendChild(gameovertext);

// Create and style the new game button image element
let newGameButton = document.createElement("img");
newGameButton.src = "img/reset.png"; // Path to your button image
newGameButton.classList.add("new-game-button");
newGameButton.style.display = 'none'; // Hide initially
document.body.appendChild(newGameButton);

// Add event listener to the new game button
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

function startgame() {
    document.body.style.backgroundColor = "#FFF";
    document.body.classList.remove("dark-mode"); // Ensure dark mode class is removed
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); // used for drawing on the board

    context.drawImage(capyStanding, capy.x, capy.y, capy.width, capy.height);

    book1Img = new Image();
    book1Img.src = "./img/book1.png";

    book2Img = new Image();
    book2Img.src = "./img/book1.png";

    book3Img = new Image();
    book3Img.src = "./img/book1.png";

    requestAnimationFrame(update);
    setInterval(placebook, 1000); // 1000 milliseconds = 1 second
    document.addEventListener("keydown", movecapy);
    document.addEventListener("keyup", stop_ducking);

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
            // cloudArray = [];
            score = 0;
            gameOver = false;
            startagain = false;
            gameovertext.style.display = 'none'; // Hide game over text
            newGameButton.style.display = 'none'; // Hide new game button
            document.body.style.backgroundColor = "#FFF"; // Reset to daytime
            document.body.classList.remove("dark-mode"); // Remove dark mode text color
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
        capyImg = capyDead;
        gameovertext.style.display = 'block'; // Show game over text
        newGameButton.style.display = 'block'; // Show new game button
        clearTimeout(darkModeTimeout); // Clear the dark mode timer

        if (score > highScore) {
            highScore = score;  // Update high score
        }
    }
    context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);

    // speed up
    velocityX -= 0.0045

    // score
        context.fillStyle = "black";
        context.font = "20px courier";
        score++;
        context.fillText(score, board.width - 65, 25);
        context.fillText("HI " + (highScore + 1), board.width - 160, 25);
}

function movecapy(e) {
    if (gameOver) {
        startagain = true;
    }
    
    if ((e.code == "Space" || e.code == "ArrowUp") && capy.y == capyY) {
        //jump
        velocityY = -8;
    }
    else if (e.code == "ArrowDown" && capy.y == capyY) {
        ducking = true
    }
    
}

function stop_ducking() {
    ducking = false
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
    
    if (placebookChance > .85) { //10% you get book3
        book.img = book3Img;
        book.width = book3Width;
        bookArray.push(book);
    }
    else if (placebookChance > .70) { //30% you get book2
        book.img = book2Img;
        book.width = book2Width;
        bookArray.push(book);
    }
    else if (placebookChance > .40) { //50% you get book1
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
        
        // Define precise bounding boxes for the books
        let bookBoundingBox = {
            x: book.x + 10, // Adjust these values to fit the image better
            y: book.y + 10,
            width: book.width - 20,
            height: book.height - 20
        };
        
        if (capy.x < bookBoundingBox.x + bookBoundingBox.width &&   // a's top left corner doesn't reach b's top right corner
            capy.x + capy.width > bookBoundingBox.x &&   // a's top right corner passes b's top left corner
            capy.y < bookBoundingBox.y + bookBoundingBox.height &&  // a's top left corner doesn't reach b's bottom left corner
            capy.y + capy.height > bookBoundingBox.y) {  // a's bottom left corner passes b's top left corner
            gameOver = true;
            if (score > highScore) {
                highScore = score;
            }
        }
    }
}
  
window.onload = startgame()

function toggleDarkMode() {
    let body = document.body;
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        body.style.backgroundColor = "#FFF"; // Switch to light background
    } else {
        body.classList.add("dark-mode");
        body.style.backgroundColor = "#333"; // Switch to dark background
    }
}

// Replace the direct style changes in the setTimeout or any other function with a call to this toggle function
setTimeout(toggleDarkMode, 40000); // Adjust to your preferred timing
