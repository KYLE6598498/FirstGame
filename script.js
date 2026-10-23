var blockSize = 25;
var rows = 25;
var cols = 40;

var board;
var context;

var binyaX = blockSize * 4;
var binyaY = blockSize * 6;

var velocityX = 0;
var velocityY = 0;

var binyaBody = [];

var foodX;
var foodY;

var gameOver = false;
var gameLoop;

var binyaImg = new Image();
binyaImg.src = "binya.jpg";

function pildiNaka(title) {
    gameOver = true;
    clearInterval(gameLoop);

    var titleElem = document.getElementById("title");
    if (titleElem) {
        titleElem.innerText = title;
    }

    var gameOverScreen = document.getElementById("gameover");
    if (gameOverScreen) {
        gameOverScreen.classList.remove("hidden");
    }
}

function resetGame() {
    binyaX = blockSize * 4;
    binyaY = blockSize * 6;

    binyaBody = [];
    velocityX = 0;
    velocityY = 0;
    gameOver = false;

    var gameOverScreen = document.getElementById("gameover");
    if (gameOverScreen) {
        gameOverScreen.classList.add("hidden");
    }

    randomfood();

    clearInterval(gameLoop);
    gameLoop = setInterval(update, 100);
}

window.onload = function () {
    board = document.getElementById("board");

    board.width = cols * blockSize;
    board.height = rows * blockSize;

    context = board.getContext("2d");

    randomfood();

    document.addEventListener("keydown", changeDirection);

    var restartBtn = document.getElementById("restart");

    if (restartBtn) {
        restartBtn.addEventListener("click", resetGame);
    }

    var directionButtons = document.querySelectorAll(
        "#controls button[data-direction]"
    );

    directionButtons.forEach(function (button) {
        button.addEventListener("pointerdown", function (event) {
            event.preventDefault();
            moveDirection(button.dataset.direction);
        });
    });

    var startX = 0;
    var startY = 0;

    board.addEventListener("touchstart", function (event) {
        var touch = event.changedTouches[0];

        startX = touch.clientX;
        startY = touch.clientY;
    }, { passive: true });

    board.addEventListener("touchend", function (event) {
        var touch = event.changedTouches[0];

        var differenceX = touch.clientX - startX;
        var differenceY = touch.clientY - startY;

        if (Math.max(
            Math.abs(differenceX),
            Math.abs(differenceY)
        ) < 20) {
            return;
        }

        if (Math.abs(differenceX) > Math.abs(differenceY)) {
            moveDirection(differenceX > 0 ? "right" : "left");
        } else {
            moveDirection(differenceY > 0 ? "down" : "up");
        }
    }, { passive: true });

    gameLoop = setInterval(update, 100);
};

function moveDirection(direction) {
    if (gameOver) return;

    if (direction === "up" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (direction === "down" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (direction === "left" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (direction === "right" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function changeDirection(event) {
    var keyDirections = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right"
    };

    var direction = keyDirections[event.key];

    if (direction) {
        event.preventDefault();
        moveDirection(direction);
    }
}

function update() {
    if (gameOver || !context) return;

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (binyaX === foodX && binyaY === foodY) {
        binyaBody.push([binyaX, binyaY]);
        randomfood();
    }

    for (var i = binyaBody.length - 1; i > 0; i--) {
        binyaBody[i] = binyaBody[i - 1];
    }

    if (binyaBody.length > 0) {
        binyaBody[0] = [binyaX, binyaY];
    }

    binyaX += velocityX * blockSize;
    binyaY += velocityY * blockSize;

    if (binyaImg.complete && binyaImg.naturalWidth > 0) {
        context.drawImage(
            binyaImg,
            binyaX,
            binyaY,
            blockSize,
            blockSize
        );

        for (var j = 0; j < binyaBody.length; j++) {
            context.drawImage(
                binyaImg,
                binyaBody[j][0],
                binyaBody[j][1],
                blockSize,
                blockSize
            );
        }
    } else {
        context.fillStyle = "lime";
        context.fillRect(binyaX, binyaY, blockSize, blockSize);
    }

    if (
        binyaX < 0 ||
        binyaX >= cols * blockSize ||
        binyaY < 0 ||
        binyaY >= rows * blockSize
    ) {
        pildiNaka("GAME OVER! 👎 lapas naka bai");
        return;
    }

    for (var k = 0; k < binyaBody.length; k++) {
        if (
            binyaX === binyaBody[k][0] &&
            binyaY === binyaBody[k][1]
        ) {
            pildiNaka("GAME OVER! 👎 Maak man ka bai");
            return;
        }
    }
}

function randomfood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}