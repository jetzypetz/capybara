"use strict";

//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//capy
let capyWidth = 88;
let capyHeight = 94;
let capyX = 50;
let capyY = boardHeight - capyHeight;
let capyImg;

let capy = {
    x : capyX,
    y : capyY,
    width : capyWidth,
    height : capyHeight
}

//book
let bookArray = [];

let book1Width = 63;
let book2Width = 69;
let book3Width = 102;

let bookHeight = 70;
let bookX = 700;
let bookY = boardHeight - bookHeight;

let book1Img;
let book2Img;
let book3Img;

//physics
let velocityX = -8; //book moving left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial capysaur
    // context.fillStyle="green";
    // context.fillRect(capy.x, capy.y, capy.width, capy.height);

    capyImg = new Image();
    capyImg.src = "./img/capy.png";
    capyImg.onload = function() {
        context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);
    }

    book1Img = new Image();
    book1Img.src = "./img/book1.png";

    book2Img = new Image();
    book2Img.src = "./img/book2.png";

    book3Img = new Image();
    book3Img.src = "./img/book3.png";

    requestAnimationFrame(update);
    setInterval(placebook, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", movecapy);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //capy
    velocityY += gravity;
    capy.y = Math.min(capy.y + velocityY, capyY); //apply gravity to current capy.y, making sure it doesn't exceed the ground
    context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);

    //book
    for (let i = 0; i < bookArray.length; i++) {
        let book = bookArray[i];
        book.x += velocityX;
        context.drawImage(book.img, book.x, book.y, book.width, book.height);

        if (detectCollision(capy, book)) {
            gameOver = true;
            capyImg.src = "./img/capy-dead.png";
            capyImg.onload = function() {
                context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);
            }
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function movecapy(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && capy.y == capyY) {
        //jump
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && capy.y == capyY) {
        //duck
    }

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

    if (placebookChance > .90) { //10% you get book3
        book.img = book3Img;
        book.width = book3Width;
        bookArray.push(book);
    }
    else if (placebookChance > .70) { //30% you get book2
        book.img = book2Img;
        book.width = book2Width;
        bookArray.push(book);
    }
    else if (placebookChance > .50) { //50% you get book1
        book.img = book1Img;
        book.width = book1Width;
        bookArray.push(book);
    }

    if (bookArray.length > 5) {
        bookArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

