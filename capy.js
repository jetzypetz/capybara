"use strict";

// board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// capy
let capyWidth = 70;
let capyHeight = 70;
let capyX = 50;
let capyY = boardHeight - capyHeight;
let capyImg;

let capy = {
    x: capyX,
    y: capyY,
    width: capyWidth,
    height: capyHeight
}

// book
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

// pen
let penArray = [];
let pen;

let pen1Width = 30;
let pen2Width = 50;

let penHeight = 50;
let penX = 800;
let penY = boardHeight - penHeight;

let pen1Img;
let pen2Img;

// physics
let velocityX = -4.5; // book moving left speed
let velocityY = 0;
let gravity = .32;

let gameOver = false;
let startagain = false;
let score = 0;
let highScore = 0;

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
newGameButton.addEventListener("click", function () {
    startagain = true;
});

function startgame() {
    document.body.style.backgroundColor = "#FFF";
    document.body.classList.remove("dark-mode"); // Ensure dark mode class is removed
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); // used for drawing on the board

    capyImg = new Image();
    capyImg.src = "./img/capy1.png";
    capyImg.onload = function () {
        context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);
    }

    book1Img = new Image();
    book1Img.src = "./img/book1.png";

    book2Img = new Image();
    book2Img.src = "./img/book2.png";

    book3Img = new Image();
    book3Img.src = "./img/book3.png";

    pen1Img = new Image();
    pen1Img.src = "img/pen.png";

    pen2Img = new Image();
    pen2Img.src = "img/pngwing.com (5).png";

    requestAnimationFrame(update);
    setInterval(placeObstacle, 1000); // 1000 milliseconds = 1 second
    document.addEventListener("keydown", movecapy);

    // Set the dark mode timer
    darkModeTimeout = setTimeout(function () {
        document.body.style.backgroundColor = "#333"; // Change to a dark background for 'nighttime'
        document.body.classList.add("dark-mode"); // Apply dark mode text color
    }, 30000); // 0.5 minute

}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        if (startagain) {
            capyImg.src = "./img/capy1.png";
            capyImg.onload = function () {
                context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);
            }
            velocityX = -4.5;
            bookArray = [];
            penArray = [];
            score = 0;
            gameOver = false;
            startagain = false;
            gameovertext.style.display = 'none'; // Hide game over text
            newGameButton.style.display = 'none'; // Hide new game button
            document.body.style.backgroundColor = "#FFF"; // Reset to daytime
            document.body.classList.remove("dark-mode"); // Remove dark mode text color
            darkModeTimeout = setTimeout(function () {
                document.body.style.backgroundColor = "#333"; // Change to a dark background for 'nighttime'
                document.body.classList.add("dark-mode"); // Apply dark mode text color
            }, 30000); // 0.5 minute
        } else {
            return;
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

    // pens
    for (let i = 0; i < penArray.length; i++) {
        let pen = penArray[i];
        pen.x += velocityX;
        context.drawImage(pen.img, pen.x, pen.y, pen.width, pen.height);
    }

    detectCollision();

    if (gameOver) {
        capyImg.src = "./img/capy-dead.png";
        gameovertext.style.display = 'block'; // Show game over text
        newGameButton.style.display = 'block'; // Show new game button
        clearTimeout(darkModeTimeout); // Clear the dark mode timer
        capyImg.onload = function () {
            context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);
        }
        if (score > highScore) {
            highScore = score;  // Update high score
        }
    } else {
        context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);
    }

    // speed up
    velocityX -= 0.002

    // score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, board.width - 60, 25);
    context.fillText("HI " + highScore, board.width - 155, 25);
}

function movecapy(e) {
    if (gameOver) {
        startagain = true;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && capy.y == capyY) {
        // jump
        velocityY = -8;
    }
    else if (e.code == "ArrowDown" && capy.y == capyY) {
        // duck
    }

}

function placeObstacle() {
    if (gameOver) {
        return;
    }

    let placeChance = Math.random();

    if (placeChance < 0.5) {
        // place book
        let book = {
            img: null,
            x: bookX,
            y: bookY,
            width: null,
            height: bookHeight
        }

        let bookChance = Math.random(); // 0 - 0.9999...

        if (bookChance > .90) { // 10% you get book3
            book.img = book3Img;
            book.width = book3Width;
        } else if (bookChance > .70) { // 30% you get book2
            book.img = book2Img;
            book.width = book2Width;
        } else if (bookChance > .50) { // 50% you get book1
            book.img = book1Img;
            book.width = book1Width;
        }
        bookArray.push(book);
    } else {
        // place pen
        let pen = {
            img: null,
            x: penX,
            y: penY,
            width: null,
            height: penHeight
        }

        let penChance = Math.random(); // 0 - 0.9999...

        if (penChance > .75) { // 25% you get pen2
            pen.img = pen2Img;
            pen.width = pen2Width;
        } else { // 75% you get pen1
            pen.img = pen1Img;
            pen.width = pen1Width;
        }
        penArray.push(pen);
    }

    if (bookArray.length > 5) {
        bookArray.shift(); // remove the first element from the array so that the array doesn't constantly grow
    }

    if (penArray.length > 5) {
        penArray.shift(); // remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision() {
    for (let i = 0; i < bookArray.length; i++) {
        let book =
