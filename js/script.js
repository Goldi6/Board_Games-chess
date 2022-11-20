////////////////////////////////////////

//////////////////////////////////////
///////////////////////////////////
//board vars
const WHOLE_BOARD_Block = document.getElementById("board");
const BOARD_Block = document.getElementById("inner-board");
///////////////////////////////
//practice mode vars
const PRACTICE_CONSTRUCTOR_Block = document.getElementById(
    "practice-mode-block"
);
const PRACTICE_MODE_Checkbox = document.querySelector(
    "input[name='practice-mode']"
);
const DEFAULT_MODE_Checkbox = document.querySelector(
    "input[name='default-mode']"
);
const DELETE_MODE_Checkbox = document.querySelector(
    "input[name='delete-mode']"
);
const CLEAR_BOARD_Btn = document.querySelector("#clear-btn");
//////
const RESIGN_Btn = document.getElementById("resign-btn");
const DRAW_Btn = document.getElementById("draw-btn");
const START_GAME_Btn = document.getElementById("start-game-btn");
const STARTED_MSG_H1 = document.getElementById("started-msg");

//////////////
/////////////////
//!
const DEFAULT_BOARD_Obj = new chessGameGenerator();
var CUSTOM_BOARD_Obj = new CustomChessGameGenerator();
//TODO custom board set to const
//const CUSTOM_BOARD_Obj = new CustomChessGameGenerator();

var Copy_CUSTOM_BOARD_Obj;

//!

//////////////////

var ActiveGame = false;

/////////////////////////////////////
/////////////////////////////////

let SET_PRACTICE_BOARD_CREATOR_btn =
    document.getElementById("startPracticeMode");
let SET_DEFAULT_BOARD_btn = document.getElementById("startRegularMode");

///////////
///NOTE: PREPARE BOARD
//TODO : allow only 2 kings
//#region practice board funcs

function generatePieceObj_orUndefinedInDeleteMode(id) {
    if (DELETE_MODE_Checkbox.checked) return undefined;
    else {
        let color = () => {
            let cl = document.querySelector("input[name='color']:checked");
            return cl.value;
        };
        let piece = () => {
            let pi = document.querySelector("input[name='figure']:checked");
            return pi.value;
        };

        let figObj;
        let p = piece();
        switch (p) {
            case "pawn":
                figObj = new Pawn(color());
                break;
            case "rook":
                figObj = new Rook(color());
                break;
            case "queen":
                figObj = new Queen(color());
                break;
            case "king":
                figObj = new King(color());
                break;
            case "bishop":
                figObj = new Bishop(color());
                break;
            case "knight":
                figObj = new Knight(color());
                break;
        }

        figObj.setBrickId(id);
        return figObj;
    }
}

function repeatPreviouslyGeneratedCustomBoard() {
    if (CUSTOM_BOARD_Obj.board.length > 2) {
        CUSTOM_BOARD_Obj.board.forEach((el, index) => {
            document
                .getElementById("brick_" + index)
                .append(chessGameGenerator.generateGuiFigureElement(el));
        });
    }
}
/////////////////
/////////////////
CLEAR_BOARD_Btn.addEventListener("click", () => {
    CUSTOM_BOARD_Obj.board = [];
    for (let child of document.getElementById("inner-board").children) {
        child.innerHTML = "";
    }
});
////////////////////
/////////////
///////////
function practiceModePiecePlacement() {
    const blocks = BOARD_Block.children;

    for (let brick of blocks) {
        brick.addEventListener("click", piecePlacement);
    }
}

function piecePlacement(e) {
    let id = e.target.getAttribute("id");
    id = id.split("_");
    id = id[1];
    e.target.innerHTML = "";
    //
    if (CUSTOM_BOARD_Obj.board[id] !== undefined) {
        if (CUSTOM_BOARD_Obj.board[id].color === "white")
            CUSTOM_BOARD_Obj.whiteFigs--;
        if (CUSTOM_BOARD_Obj.board[id].color === "black")
            CUSTOM_BOARD_Obj.blackFigs--;
    }
    //
    let pieceObj = generatePieceObj_orUndefinedInDeleteMode(id);
    CUSTOM_BOARD_Obj.board[id] = pieceObj;
    //
    if (pieceObj !== undefined) {
        let newPieceElement = chessGameGenerator.generateGuiFigureElement(pieceObj);
        if (
            (pieceObj.color == "white" &&
                CUSTOM_BOARD_Obj.whiteFigs < chessGameGenerator.maxPiecesForEachSide) ||
            (pieceObj.color == "black" &&
                CUSTOM_BOARD_Obj.blackFigs < chessGameGenerator.maxPiecesForEachSide)
        ) {
            e.target.appendChild(newPieceElement);
            //TODO : create array observer
            if (pieceObj.color === "white") CUSTOM_BOARD_Obj.whiteFigs++;
            if (pieceObj.color === "black") CUSTOM_BOARD_Obj.blackFigs++;
        }
    }
}

function removeTestModeListener() {
    for (let brick of BOARD_Block.children) {
        brick.removeEventListener("click", piecePlacement);
    }
}

//#endregion
//#region practice board ubicode funcs

//FIXME: piece unicode on hover (setting unicode from script to root CSS doesn't work)
let root = document.querySelector(":root");

console.log(getComputedStyle(root).getPropertyValue("--chess-unicode"));

function setUnicode() {
    color = document.querySelector("input[name='color']:checked").value;
    fig = document.querySelector("input[name='figure']:checked").value;
    let uni = getFigUnicode(fig, color);
    let root = document.querySelector(":root");
    console.log(uni);
    let convertedUni = unicode_decToHex(uni);
    //convertedUni = String.fromCharCode(parseInt(convertedUni, 16));
    console.log(color);
    color = "black" == color ? "red" : "rgb(125, 110, 110)";
    root.style.setProperty("--chess-unicode", convertedUni);
    root.style.setProperty("--chess-piece-color", color);

    //FIXME: unicode hover
    console.log(getComputedStyle(root).getPropertyValue("--chess-unicode"));
    console.log(getComputedStyle(root).getPropertyValue("--chess-piece-color"));
}

function unicode_decToHex(val) {
    val = val.slice(2, 6);
    //   console.log(val);
    switch (val) {
        case "9817":
            return '"\\2659"';
        case "9816":
            return '"\\2658"';
        case "9815":
            return '"\\2657"';
        case "9814":
            return '"\\2656"';
        case "9813":
            return '"\\2655"';
        case "9812":
            return '"\\2654"';
        case "9823":
            return '"\\265F"';
        case "9822":
            return '"\\265E"';
        case "9821":
            return '"\\265D"';
        case "9820":
            return '"\\265C"';
        case "9819":
            return '"\\265B"';
        case "9818":
            return '"\\265A"';
    }
}

//#endregion

SET_PRACTICE_BOARD_CREATOR_btn.addEventListener("click", (e) => {
    generateBoardInterface(true);
    repeatPreviouslyGeneratedCustomBoard();
    // document.querySelector("input[name='pawn']").checked = true;

    PRACTICE_CONSTRUCTOR_Block.style.display = "flex";
    PRACTICE_MODE_Checkbox.checked = true;
    DEFAULT_MODE_Checkbox.checked = false;
    SET_DEFAULT_BOARD_btn.removeAttribute("disabled");

    BOARD_Block.classList = "practice-mode";

    DELETE_MODE_Checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            BOARD_Block.classList.add("delete-mode");
        } else BOARD_Block.classList.remove("delete-mode");
    });

    practiceModePiecePlacement(CUSTOM_BOARD_Obj);
    showStartGameBtn();

    //////////////

    const ColorCheckBoxes = document.querySelectorAll("input[name='color']");

    ColorCheckBoxes.forEach((el) => {
        el.addEventListener("change", setUnicode);
    });

    const FigCheckBoxes = document.querySelectorAll("input[name='figure']");

    FigCheckBoxes.forEach((el) => {
        el.addEventListener("change", setUnicode);

        //
        //
    });
    ///////
});
SET_DEFAULT_BOARD_btn.addEventListener("click", (e) => {
    //  if (confirm("you practice board will be lost!!")) {
    //
    removeTestModeListener();
    PRACTICE_MODE_Checkbox.checked = false;
    PRACTICE_CONSTRUCTOR_Block.style.display = "none";
    SET_PRACTICE_BOARD_CREATOR_btn.removeAttribute("disabled");
    //
    DEFAULT_MODE_Checkbox.checked = true;
    BOARD_Block.classList = "game-mode";
    BOARD_Block.remove.children;
    //
    DEFAULT_BOARD_Obj.setDefaultChessBoard();
    //
    generateBoardInterface(true);
    DEFAULT_BOARD_Obj.placeFiguresOnGuiBoard();
    showStartGameBtn();
    //}
});

///NOTE: PLAY GAME
//#region GAME
///////////
START_GAME_Btn.addEventListener("click", (e) => {
    ///////////////
    //create clone for custom board:
    CUSTOM_BOARD_Obj.setCloneForThis();
    Copy_CUSTOM_BOARD_Obj = CUSTOM_BOARD_Obj.setDuplicateBoard(
        new CustomChessGameGenerator()
    );
    //
    console.log(CUSTOM_BOARD_Obj);
    ///
    let boardObj;
    if (
        DEFAULT_MODE_Checkbox.checked ||
        BOARD_Block.classList.contains("game-mode")
    ) {
        boardObj = DEFAULT_BOARD_Obj;
    } else if (
        PRACTICE_MODE_Checkbox.checked ||
        BOARD_Block.classList.contains("practice-mode")
    ) {
        boardObj = CUSTOM_BOARD_Obj;
        boardObj.setKingsFromCustomBoard();
    }
    //
    if (boardObj.customGameCanStart()) {
        boardObj.activeGame = true;
        setEndGameConfirmationBtn(boardObj, confirmDrawModal, DRAW_Btn);
        setEndGameConfirmationBtn(boardObj, confirmResignModal, RESIGN_Btn);
        //
        let options = document.getElementsByClassName("options")[0];
        //        console.log(options);
        options.style.display = "grid";
        //
        BOARD_Block.className = "gamePlay";
        ////////////////////
        startGame_interface(BOARD_Block, "white");
        e.target.style.display = "none";
        ///////////////////////////////////
        //TODO: set first player
        playGame(boardObj, "white");
        //////////////////////////////////
    } else {
        alert("place figures on the board!");
    }
});

///////////////

/////////////
//#region game play

function playGame(BOARD_OBJ, openingPlayer = "white") {
    // console.log(BOARD_OBJ);
    removeTestModeListener();
    disableNewBoardBtns();
    openingPlayer == "black" ?
        (BOARD_OBJ.playerIsWhite = false) :
        (BOARD_OBJ.playerIsWhite = true);
    let figIsSelected = false;

    const controller = new AbortController();
    BOARD_OBJ.prepareBoardForTests();
    let status = BOARD_OBJ.checkBoardStatus();
    console.log("STATUS: " + status);
    showAfterTurnMessage(BOARD_OBJ, status);
    if (!nextMovePermitted(status)) {
        BOARD_OBJ.activeGame = false;
        endGame(status);
    }
    highlightKing(status, BOARD_OBJ);
    removeKingHighlight(status);
    for (let brick of BOARD_Block.children) {
        brick.addEventListener(
            "click",
            (e) => {
                /////
                if (!BOARD_OBJ.activeGame) {
                    controller.abort();
                    ////
                } else {
                    let currentPlayerColor = BOARD_OBJ.playerIsWhite ? "white" : "black";
                    if (e.target.classList.contains(currentPlayerColor)) {
                        const FIG_ELEM = e.target;
                        //  console.log(FIG_ELEM);
                        const FIG_ID = getId(FIG_ELEM);
                        // const FIG = BOARD_OBJ.board[FIG_ID];
                        //!
                        let testMsg = `${FIG_ELEM.className} on${FIG_ID} : `;
                        //console.log(BOARD_OBJ);
                        //console.log(FIG.getJumpMoves(BOARD_OBJ));
                        if (BOARD_OBJ.setFigToMove(FIG_ID)) {
                            ///
                            let availableMoves = BOARD_OBJ.availableMovesToMake.concat(
                                BOARD_OBJ.availableCapturesToMake
                            );
                            if (BOARD_OBJ.availableCastlingToMake.length > 0) {
                                availableMoves.concat(BOARD_OBJ.availableCastlingToMake);
                            }
                            if (BOARD_OBJ.availableEnPassantToMake.length > 0) {
                                availableMoves.concat(BOARD_OBJ.availableEnPassantToMake);
                            }
                            //TODO hight light moves
                            // for (let i = 0; i < availableMoves.length; i++) {
                            //     let id_highMoves = "brick_" + availableMoves[i];
                            //     let b = document.getElementById(id_highMoves);

                            //     console.log(b);

                            //     if (b) {
                            //         b.classList.add("highlight-move");
                            //     }
                            // }

                            ///////
                            console.log(testMsg + "can MOVE!!");
                            hightLightSelectedFigure(FIG_ELEM);
                            figIsSelected = true;
                        } else {
                            console.log(testMsg + "can NOT MOVE!!");
                        }
                    } else if (figIsSelected) {
                        const BRICK_ID = getId(e.target);
                        //console.log(BRICK_ID);
                        if (BOARD_OBJ.setBrickToMakeTheMoveTo(BRICK_ID)) {
                            //console.log("move selection resolved!");
                            //console.log(BOARD_OBJ);
                            let elPassant = "";
                            let __pawnUpgrade = false;
                            let moveType = BOARD_OBJ.playTurnTo(BRICK_ID);
                            console.log("XXXXXXXXXXXXXXXXXXXX");
                            console.log(moveType);
                            if (moveType.includes("pawnUpgrade")) {
                                moveType = moveType.split("__");
                                ///TODO:set
                                __pawnUpgrade = true;
                                moveType = moveType[0];
                            } else if (moveType.includes("enPassant")) {
                                moveType = moveType.split("_");
                                elPassant = moveType[1];
                                moveType = moveType[0];
                                console.log("PPPPPPPPPPPPPPPPPPPPP" + elPassant);
                                console.log("PPPPPPPPPPPPPPPPPPPPP" + moveType);
                            }
                            //console.log(BOARD_OBJ);
                            ////////////////////////
                            ///////////////////////
                            ///////////////////////////

                            if (moveType == "castle") {
                                guiCastle(BRICK_ID, BOARD_OBJ);
                                endTurn(BOARD_OBJ);
                            } else if (moveType == "enPassant") {
                                console.log("MMMMMMMMMMMMMm");
                                guiElPassant(BRICK_ID, BOARD_OBJ, elPassant);
                                endTurn(BOARD_OBJ);
                            } else {
                                if (__pawnUpgrade) {
                                    //let upgradeTo = selectPawnUpgrade(BRICK_ID);
                                    // BOARD_OBJ.upgradePawn(upgradeTo, BRICK_ID);
                                    selectPawnUpgrade(BRICK_ID, BOARD_OBJ, endTurn);
                                } else {
                                    guiMove(BRICK_ID, BOARD_OBJ);
                                    endTurn(BOARD_OBJ);
                                }
                            }

                            //!instead of this: endTurn(BOARD_OBJ);
                            figIsSelected = false;
                        } else {
                            console.log("move selection rejected!");
                        }
                    }
                }
            }, { signal: controller.signal }
        );
        //}
    }
    //THIupdates count, ends turn in class, shows message, and checks for board status, and if needed ends game
    function endTurn(BOARD_OBJ) {
        let hi_moves = document.getElementsByClassName("highlight-move");
        for (let el of hi_moves) {
            el.classList.remove("highlight-move");
        }
        updateCount(BOARD_OBJ);
        BOARD_OBJ.endTurn();

        let status = BOARD_OBJ.checkBoardStatus();

        console.log("STATUS: " + status);

        ///
        ///
        showAfterTurnMessage(BOARD_OBJ, status);
        if (!nextMovePermitted(status)) {
            BOARD_OBJ.activeGame = false;
            endGame(status);
        }
        highlightKing(status, BOARD_OBJ);
        removeKingHighlight(status);
    }

    function nextMovePermitted(status) {
        switch (status) {
            case "turn":
            case "check":
                return true;
            case "checkmate":
            case "stalemate":
            case "50 Rule Draw":
            case "Three Fold Draw":
            case "insufficient Material":
                return false;
        }
    }
    //TODO hints
    function addHint() {}

    function getId(el) {
        let arr = el.getAttribute("id").split("_");
        return parseInt(arr[1]);
    }
}

function showAfterTurnMessage(BOARD_OBJ, stat) {
    let color = BOARD_OBJ.playerIsWhite ? "White" : "Black";

    let message;
    switch (stat) {
        case "turn":
        case "check":
        case "checkmate":
        case "stalemate":
            message = color + " " + stat + "!";
            break;
        case "50 Rule Draw":
        case "Three Fold Draw":
            message = stat + "!";

            break;
    }

    document.getElementById("started-msg").innerHTML = message;
}

function endGame(msg = "") {
    DEFAULT_BOARD_Obj.setDefaultChessBoard();
    msg += "\n";
    CUSTOM_BOARD_Obj = Copy_CUSTOM_BOARD_Obj;
    displayEndGame();
    enableNewBoardBtns();

    showEndGameModal(msg);
}

function displayEndGame() {
    //GUI
    remove_hightLightSelectedFigure();
    let msgEl = document.getElementById("main-game-header");
    msgEl.innerHTML = "Game Ended!";
    let options = document.getElementsByClassName("options")[0];
    options.style.display = "none";
    //TODO add summary
}
//#endregion

//#region side board
function updateCount(boardObj) {
    let blackCountEl = document.querySelector("#count-red .count span");
    let whiteCountEl = document.querySelector("#count-white .count span");

    let blackCount = boardObj.blackScore;
    let whiteCount = boardObj.whiteScore;
    console.log("SCORE");
    console.log(whiteCount);

    blackCountEl.innerHTML = blackCount;
    whiteCountEl.innerHTML = whiteCount;
}
//#endregion
//#region gui pieces movements

function guiCastle(BRICK_ID, BOARD_OBJ) {
    let kingId = BOARD_OBJ.playerIsWhite ? 61 : 5;

    let rookId = BRICK_ID > kingId ? kingId + 1 : kingId - 1;
    let oldRookId = BRICK_ID > kingId ? kingId + 3 : kingId - 4;
    kingId = BRICK_ID > kingId ? kingId + 2 : kingId - 2;
    console.log(kingId);
    let kingElem = chessGameGenerator.generateGuiFigureElement(
        BOARD_OBJ.board[kingId]
    );
    let rookElem = chessGameGenerator.generateGuiFigureElement(
        BOARD_OBJ.board[rookId]
    );
    let rookPositionId = "brick_" + rookId;
    let kingPositionId = "brick_" + kingId;
    let oldRookPositionId = "brick_" + oldRookId;
    document.getElementById(rookPositionId).append(rookElem);
    document.getElementById(kingPositionId).append(kingElem);
    document
        .getElementById(oldRookPositionId)
        .querySelector(".chess-piece")
        .remove();

    document.querySelector(".selected").querySelector(".chess-piece").remove();
}

function guiMove(BRICK_ID, BOARD_OBJ) {
    let figElem = chessGameGenerator.generateGuiFigureElement(
        BOARD_OBJ.board[BRICK_ID]
    );
    let newPosition = "brick_" + BRICK_ID;

    if (document.getElementById(newPosition).querySelector(".chess-piece")) {
        document.getElementById(newPosition).querySelector(".chess-piece").remove();
    }
    document.getElementById(newPosition).append(figElem);

    document.querySelector(".selected").querySelector(".chess-piece").remove();
}

function guiElPassant(BRICK_ID, BOARD_OBJ, capId) {
    guiMove(BRICK_ID, BOARD_OBJ);
    let newPosition = "brick_" + capId;

    if (document.getElementById(newPosition).querySelector(".chess-piece")) {
        document.getElementById(newPosition).querySelector(".chess-piece").remove();
    }
}

//#endregion
//#region btns
function showStartGameBtn() {
    if (document.getElementById("started-msg")) {
        document.getElementById("started-msg").remove();
        START_GAME_Btn.style.display = "block";
    }
}

function disableNewBoardBtns() {
    SET_DEFAULT_BOARD_btn.setAttribute("disabled", true);
    SET_PRACTICE_BOARD_CREATOR_btn.setAttribute("disabled", true);
    PRACTICE_CONSTRUCTOR_Block.style.display = "none";
}

function enableNewBoardBtns() {
    SET_DEFAULT_BOARD_btn.removeAttribute("disabled");
    SET_PRACTICE_BOARD_CREATOR_btn.removeAttribute("disabled");
}

function setEndGameConfirmationBtn(BOARD_OBJ, confirmFunc, btn) {
    btn.removeAttribute("disabled");
    const controller = new AbortController();

    btn.addEventListener(
        "click",
        () => {
            console.log("here");

            confirmFunc(BOARD_OBJ, controller);
        }, { signal: controller.signal }
    );
}
//#endregion
//#region modals
function confirmDrawModal(BOARD_OBJ, controller) {
    //TODO: server draw handler
    let msg = GameMessages.confirmDraw();
    showModal("draw", msg);
    const modal = document.getElementById("select-modal");
    const msgParagraph = modal.getElementsByTagName("p")[0];
    const reject = document.getElementById("close-modal-btn");
    const accept = document.getElementById("draw-game-btn");
    const or = modal.getElementsByTagName("span")[0];
    let gotAns = false;

    reject.addEventListener("click", () => {
        if (!gotAns) {
            gotAns = true;
            msgParagraph.innerHTML = GameMessages.drawAnswer(false);
            reject.innerHTML = "Close";
            accept.remove();
            or.remove();
        } else {
            modal.remove();
        }
        // server func
    });
    accept.addEventListener("click", (e) => {
        modal.remove();
        endGame(GameMessages.drawAnswer(true));
        BOARD_OBJ.activeGame = false;

        controller.abort();
        // server func
    });
}

function confirmResignModal(BOARD_OBJ, controller) {
    //TODO: server resign handler

    let msg = GameMessages.confirmResign();
    showModal("resign", msg);
    const modal = document.getElementById("select-modal");
    const close = document.getElementById("close-modal-btn");
    const resign = document.getElementById("resign-game-btn");
    close.addEventListener("click", () => {
        modal.remove();
        // server func
    });
    resign.addEventListener("click", () => {
        modal.remove();
        endGame();
        BOARD_OBJ.activeGame = false;
        controller.abort();

        // server func
    });
}

function showEndGameModal(msg) {
    showModal("reset", msg);
    const modal = document.getElementById("select-modal");
    const close = document.getElementById("close-modal-btn");
    const reset = document.getElementById("reset-game-btn");
    close.addEventListener("click", () => {
        modal.remove();
    });
    reset.addEventListener("click", () => {
        modal.remove();
        showStartGameBtn();
        SET_DEFAULT_BOARD_btn.click();
    });
}
//? draggable modal?
function showModal(btnOptionType, msg = "") {
    let btnText, cancelBtnText;
    switch (btnOptionType) {
        case "reset":
            btnText = "Setup new board";
            cancelBtnText = "Close";
            break;
        case "resign":
            btnText = "resign";
            cancelBtnText = "Cancel";
            break;
        case "draw":
            btnText = "Accept draw";
            cancelBtnText = "Reject";
            break;
    }

    const modal = document.createElement("div");
    modal.setAttribute("id", "select-modal");
    const els = `<div class='inner-modal'>
        <p>${msg}</p>
        <div class="modal-btns">
            <button id='${btnOptionType}-game-btn'>${btnText}</button>
            <span>or</span>
            <button id='close-modal-btn'>${cancelBtnText}</button>
        </div>
        </div>`;
    modal.innerHTML = els;

    document.body.append(modal);
}

function selectPawnUpgrade(id, boardObj, endTurnFunc) {
    let brick = document.getElementById("brick_" + id);
    console.log(brick);
    /////
    //style
    let style = window.getComputedStyle(brick);
    let height = style.height;
    let width = style.width;

    ////////
    let block = document.createElement("span");
    block.setAttribute("id", "pawn-upgrade-box");
    block.style.top = height;
    block.style.right = width;
    /////
    const modal = document.createElement("div");
    modal.setAttribute("id", "select-modal");
    const body = document.querySelector("body");
    console.log(body);
    body.append(modal);
    //////

    const queenUni = ["&#9813;", "&#9819;"];
    const bishopUni = ["&#9815;", "&#9821;"];
    const knightUni = ["&#9816;", "&#9822;"];
    const rookUni = ["&#9814;", "&#9820;"];
    const pawnUni = ["&#9817;", "&#9823;"];
    let i = boardObj.board[id].color == "white" ? 0 : 1;
    /////
    let selectBox = `<span >Upgrade:</span>

      <label><input type='radio' style='display:none' name='pawn-upgrade' value="queen">${queenUni[i]} Queen</label>
      <label><input type='radio' style='display:none' name='pawn-upgrade' value="bishop">${bishopUni[i]} Bishop</label>
      <label><input type='radio' style='display:none' name='pawn-upgrade' value="knight">${knightUni[i]} Knight</label>
      <label><input type='radio' style='display:none' name='pawn-upgrade' value="rook">${rookUni[i]} Rook</label>
      <label><input type='radio' style='display:none' name='pawn-upgrade' value="pawn">${pawnUni[i]} Pawn</label>
        `;
    block.innerHTML = selectBox;

    brick.append(block);
    let selection = document.querySelectorAll("input[name='pawn-upgrade']");
    let setValue = "";
    console.log(selection);
    selection.forEach((el) => {
        console.log(el);
        el.addEventListener("change", () => {
            if (el.checked) {
                setValue = el.value;
                console.log(setValue);
                boardObj.upgradePawn(setValue, id);
                guiMove(id, boardObj);

                block.remove();
                modal.remove();
                endTurnFunc(boardObj);
            }
        });
    });
}
//#endregion

//#region highlight funcs
function hightLightSelectedFigure(figElem) {
    if (
        document.querySelector(".selected") &&
        document.querySelector(".selected") !== figElem
    )
        document.querySelector(".selected").classList.remove("selected");
    figElem.parentNode.classList.add("selected");
}

function remove_hightLightSelectedFigure() {
    if (document.querySelector(".selected"))
        document.querySelector(".selected").classList.remove("selected");
}

function highlightKing(status, BOARD_OBJ) {
    if (status == "check" || status == "checkmate") {
        console.log("king");
        let kingId = BOARD_OBJ.playerIsWhite ?
            BOARD_OBJ.whiteKingId :
            BOARD_OBJ.blackKingId;

        let el = document.getElementById("_" + kingId);

        el.classList.add("king-highlight");
        console.log(el);
    }
}

function removeKingHighlight(status) {
    if (document.querySelector(".king-highlight")) {
        if (status !== "check" && status !== "checkmate") {
            console.log(status);
            let king = document.querySelector(".king-highlight");

            king.classList.remove("king-highlight");
        }
    }
}

//#endregion

/////////////////////////
/////////////////////////
/////////////////////////
/////////////////////////
/////////////////////////
/////////////////////////
/////////////////////////
/////////////////////////
window.onload = () => {
    SET_DEFAULT_BOARD_btn.click();
    setUnicodeToButtons();
};

function setUnicodeToButtons() {
    let color = document.querySelector("input[name='color']:checked").value;
    let checkButtons = document.querySelectorAll("input[name='figure']");
    checkButtons.forEach((el) => {
        let val = el.value;
        let parent = el.parentNode;
        // console.log(parent);
        let uni = getFigUnicode(val, color);
        let span = parent.getElementsByTagName("span")[0];
        span.innerText = "a";
        //console.log(span);
        // console.log(uni);
        span.innerHTML = uni;
    });
}

function getFigUnicode(fig, color) {
    let i = color == "white" ? 0 : 1;
    const figsUni = {
        pawn: ["&#9817;", "&#9823;"],
        rook: ["&#9814;", "&#9820;"],
        queen: ["&#9813;", "&#9819;"],
        bishop: ["&#9815;", "&#9821;"],
        knight: ["&#9816;", "&#9822;"],
        king: ["&#9812;", "&#9818;"],
    };
    //console.log(fig);
    let uni = figsUni[fig];
    // console.log(uni);
    //debugger;

    return uni[i];
}

///////////
//TODO: reverse board button

let reverseBtb = document.getElementById("reverse-board");
reverseBtb.onclick = () => {};
//////////