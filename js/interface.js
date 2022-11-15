function generateBoardBricks(isWhiteView) {
    let board = document.getElementById("inner-board");
    let count = 0;
    let color = true;
    let brickCount = isWhiteView ? 1 : -64;
    if (board.hasChildNodes) {
        let child = board.lastElementChild;
        while (child) {
            board.removeChild(child);
            child = board.lastElementChild;
        }
    }

    while (count < 64) {
        count++;
        const brick = document.createElement("div");
        ////////////////
        //?helper
        const num = document.createElement("span");
        num.innerHTML = Math.abs(brickCount);
        num.classList.add("num");
        //NOTE: add numbering on the board
        //brick.appendChild(num);
        ////////////////
        brick.classList.add("brick");
        if (color) brick.classList.add("white-brick");
        else {
            brick.classList.add("black-brick");
        }
        brick.setAttribute("id", "brick_" + Math.abs(brickCount++));
        board.appendChild(brick);
        if (count % 8 !== 0) color = !color;
    }
}

function generateBoardStripes(playerIsWhite) {
    /////////////////////////////////////////////
    if (document.querySelector(".stripe-row").children.length == 0) {
        let stripeRow = document.querySelector(
            "#checkers-gameSpace>.board>.stripe-row"
        );
        let stripeCol = document.querySelector(
            "#checkers-gameSpace>.board>.stripe-col"
        );
        // console.log(stripeCol);
        count = 0;
        let uniCode_Roman = [
            "\u{2160}",
            "\u{2161}",
            "\u{2162}",
            "\u{2163}",
            "\u{2164}",
            "\u{2165}",
            "\u{2166}",
            "\u{2167}",
        ];
        uniCode_Roman.forEach((u) => {
            let item = document.createElement("div");
            item.innerHTML = u;
            if (playerIsWhite) stripeCol.prepend(item);
            else stripeCol.append(item);
        });
        for (let char = 65; char <= 72; char++) {
            let item = document.createElement("div");
            item.innerHTML = String.fromCharCode(char);
            stripeRow.appendChild(item);
        }
    }
}

function generateBoardInterface(playerIsWhite) {
    generateBoardBricks(playerIsWhite);
    generateBoardStripes(playerIsWhite);
}

function startGame_interface(BOARD_BLOCK, color) {
    let gameStartedText = document.createElement("h1");
    gameStartedText.setAttribute("id", "started-msg");
    gameStartedText.innerHTML = color + " Turn!";
    BOARD_BLOCK.parentNode.parentNode.appendChild(gameStartedText);
    document.getElementById("main-game-header").innerHTML = "GAME STARTED";
}

class BoardGui {}