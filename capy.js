"use strict";

//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//capy
let capyWidth = 70; // 90
let capyHeight = 70;// 90
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
let book;

let book1Width = 45; //63
let book2Width = 60; // 80
let book3Width = 80; // 100

let bookHeight = 50; // 79
let bookX = 800;
let bookY = boardHeight - bookHeight;

let book1Img;
let book2Img;
let book3Img;

//physics
let velocityX = -4.5; //6 book moving left speed
let velocityY = 0;
let gravity = .32; // .4

let gameOver = false;
let startagain = false;
let score = 0;
let highscore = 0;

function startgame() {
    document.body.style.backgroundColor = "#FFF";

    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    
    context = board.getContext("2d"); //used for drawing on the board
    
    //draw initial capysaur
    // context.fillStyle="green";
    // context.fillRect(capy.x, capy.y, capy.width, capy.height);
    
    capyImg = new Image();
    capyImg.src = "./img/capy1.png";
    capyImg.onload = function() {
        context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);
    }
    
    book1Img = new Image();
    book1Img.src = "./img/book1.png";
    
    book2Img = new Image();
    book2Img.src = "./img/book1.png";
    
    book3Img = new Image();
    book3Img.src = "./img/book1.png";
    
    requestAnimationFrame(update);
    setInterval(placebook, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", movecapy);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        if (startagain) {
            capyImg.src = "./img/capy1.png";
            capyImg.onload = function() {
                context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);
            }
            velocityX = -4.5; // 6
            bookArray = []
            score = 0;
            gameOver = false;
            startagain = false;
        } else {
            return
        }
    }
    context.clearRect(0, 0, board.width, board.height);
    
    //capy
    velocityY += gravity;
    capy.y = Math.min(capy.y + velocityY, capyY); //apply gravity to current capy.y, making sure it doesn't exceed the ground
    
    //book
    for (let i = 0; i < bookArray.length; i++) {
        let book = bookArray[i];
        book.x += velocityX;
        context.drawImage(book.img, book.x, book.y, book.width, book.height);
    }
    
    detectCollision(score)
    
    if (gameOver) {
        capyImg.src = "./img/capy-dead.png";
        capyImg.onload = function() {
            context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);
        }
    } else {
        context.drawImage(capyImg, capy.x, capy.y, capy.width, capy.height);
    }
    
    // speed up
    velocityX -= 0.002 // 5
    
    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
    context.fillText(highscore, 700, 20)
}

function movecapy(e) {
    if (gameOver) {
        startagain = true;
    }
    
    if ((e.code == "Space" || e.code == "ArrowUp") && capy.y == capyY) {
        //jump
        velocityY = -8; // 10
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

function detectCollision() {
    for (let i = 0; i < bookArray.length; i++) {
        book = bookArray[i];
        if (capy.x < book.x + book.width &&   //a's top left corner doesn't reach b's top right corner
        capy.x + capy.width > book.x &&   //a's top right corner passes b's top left corner
        capy.y < book.y + book.height &&  //a's top left corner doesn't reach b's bottom left corner
        capy.y + capy.height > book.y) {
            gameOver = true;
            if (score > highscore) {
                highscore = score + 1;
            }
        }
    }
}

setTimeout(function() {
    document.body.style.backgroundColor = "#333"; // Change to a dark background for 'nighttime'
  }, 30000); // 0.5 minute
  
window.onload = startgame()