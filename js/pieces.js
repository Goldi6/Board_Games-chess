class ChessPice {
    static maxRange = 8;
    constructor(color, type = "chessPiece") {
        this.color = color;
        this.isWhite = color == "white" ? true : false;
        this.type = type;
        this.letterSign = (this.color[0] + this.type[0]).toUpperCase();
        this.legalMoves = [];
        this.legalCaptures = [];
    }

    pieceBelongsToCurrentPlayer(boardObj) {
        return boardObj.playerIsWhite === this.isWhite;
    }
    setBrickId(id) {
        this.brickId = parseInt(id);
    }
    getBrickId() {
            if (this.brickId === undefined) {
                return false;
            } else return parseInt(this.brickId);
        }
        // getFigElem() {
        //     return this.figure;
        // }
    availableBricks() {
        alert("goood!");
    }
    canMove(boardObj) {
            /////
            ////console.log(boardObj);
            ////
            if (this.pieceBelongsToCurrentPlayer(boardObj)) {
                let moves = this.getRegularMoves(boardObj.board);
                //console.log("canMove():regMoves:" + moves);
                moves = this.getLegalMoves(moves, boardObj);
                this.legalMoves = moves;
                //console.log("moves:" + moves);
                let captures = this.getCaptureMoves(boardObj.board);
                captures = this.getLegalCaptureMoves(captures, boardObj);
                this.legalCaptures = captures;
                //console.log("captures: " + captures);
                return moves.concat(captures).length > 0;
            }
            return false;
        }
        //calc single move \ null
    isRegularMove(board, moveJump) {
        if (chessGameGenerator.idIsInBoardRange(moveJump)) {
            if (board[moveJump] == null) {
                return moveJump;
            } else return null;
        }
        return null;
    }

    isCaptureMove(board, moveJump) {
        if (chessGameGenerator.idIsInBoardRange(moveJump)) {
            if (board[moveJump] != null && board[moveJump].color != this.color) {
                return moveJump;
            } else return null;
        }
        return null;
    }

    getLegalMoves(moves, boardObj) {
        let testedMoves = [];
        let id = this.brickId;
        ////console.log(moves);
        moves.forEach((movePos) => {
            //console.log("end Of tets" + testedMoves);
            let boardObjCopy = boardObj.setDuplicateBoard();
            let kingPos = this.getKingPos(boardObjCopy);
            boardObjCopy.move(id, movePos);
            let check;
            if (boardObj.board[id] instanceof King) {
                check = boardObjCopy.board[movePos].isCheck(boardObjCopy.board);
            } else {
                check = boardObjCopy.board[kingPos].isCheck(boardObjCopy.board);
            }
            if (!check) testedMoves.push(movePos);
        });
        this.setBrickId(id);

        return testedMoves;
    }
    getLegalCaptureMoves(captures, boardObj) {
        let testedMoves = [];
        let id = this.brickId;

        captures.forEach((capPos) => {
            //console.log(capPos);
            let boardObjCopy = boardObj.setDuplicateBoard();
            let kingPos = this.getKingPos(boardObjCopy);
            boardObjCopy.capture(id, capPos);
            let check;
            if (boardObj.board[id] instanceof King) {
                check = boardObjCopy.board[capPos].isCheck(boardObjCopy.board);
            } else {
                check = boardObjCopy.board[kingPos].isCheck(boardObjCopy.board);
            }
            if (!check) testedMoves.push(capPos);
        });
        this.setBrickId(id);
        return testedMoves;
    }
    getKingPos(boardObj) {
        return this.color == "white" ? boardObj.whiteKingId : boardObj.blackKingId;
    }
    setFirstMoveWasMade(figPos, MovePos) {
        if (this instanceof Pawn) {
            this.FirstMoveIsDouble = Math.abs(MovePos - figPos) == 16;
            this.initPosition = figPos;
        }
        if (this.isFirstMove) this.isFirstMove = false;
        this.letterSign += "m";
    }
}
class Pawn extends ChessPice {
    // constructor(color, type = "pawn" , board ) {
    // super(color, type,  board);
    static blackUnicode = "&#9823;";
    static whiteUnicode = "&#9817;";

    static hint =
        "pawn can only go one step forward and one step diagonally for a capture";
    constructor(color, type = "pawn") {
        super(color, type);
        this.score = 1;
        this.icon = this.isWhite ? Pawn.whiteUnicode : Pawn.blackUnicode;
        this.isFirstMove = true;
        this.forwardCalc = color == "white" ? -1 : 1;
        this.forwardCalc = color == "white" ? -1 : 1;
        this.moveJump = 8;
        //!!!!!! must change all outer board usage || delete ref
        /////
        //en passant
        this.FirstMoveIsDouble = false;
        this.initPosition = -200;

        this.enPassant = false;
        /////
    }

    getEnPassantMoves(board) {
        //console.log("EN PASSANT");
        let available = [];

        function correctFig(id, thisObj) {
            let fig = board[id];
            if (fig instanceof Pawn) {
                return fig.color != thisObj.color;
            } else return false;
        }
        if (Math.abs(this.brickId - this.initPosition) == 24) {
            //console.log("correct");
            let left = this.brickId - 1;
            let right = this.brickId + 1;

            let leftOp = correctFig(left, this);
            let rightOp = correctFig(right, this);
            //console.log("rightOp:" + rightOp);
            let leftMov = left + 8 * this.forwardCalc;
            let rightMov = right + 8 * this.forwardCalc;
            if (leftOp) available.push({ capture: left, move: leftMov });
            if (rightOp) available.push({ capture: right, move: rightMov });
        }

        return available;
    }

    getRegularMoves(board) {
        let moves = [];
        let testBrick = this.brickId + this.moveJump * this.forwardCalc;
        let move = this.isRegularMove(board, testBrick);
        if (move != null) moves.push(move);
        if (this.isFirstMove && moves.length > 0) {
            testBrick = this.brickId + this.moveJump * 2 * this.forwardCalc;
            move = this.isRegularMove(board, testBrick);
            if (move != null) moves.push(move);
        }

        moves = moves.filter((m) => m != null);
        // //console.log(moves);
        return moves;
    }
    getCaptureMoves(board) {
        let capMoves = [];
        const ID = parseInt(this.brickId);
        const LEFT_CALC = ID + 9 * this.forwardCalc;
        let boardRange = LEFT_CALC % 8 !== 0;
        let leftCapture =
            boardRange && this.isCaptureMove(board, LEFT_CALC) != null;
        ///
        const RIGHT_CALC = ID + 7 * this.forwardCalc;
        boardRange = (RIGHT_CALC - 1) % 8 != 0 || RIGHT_CALC - 1 != 0;
        let rightCapture =
            boardRange && this.isCaptureMove(board, RIGHT_CALC) != null;
        if (leftCapture) capMoves.push(LEFT_CALC);
        if (rightCapture) capMoves.push(RIGHT_CALC);
        return capMoves;
    }
}
class Rook extends ChessPice {
    static blackUnicode = "&#9820;";
    static whiteUnicode = "&#9814;";
    static calcs = [8, -8, 1, -1];
    constructor(color, type = "Rook") {
        super(color, type);
        this.score = 5;
        this.icon = this.isWhite ? Rook.whiteUnicode : Rook.blackUnicode;
        this.isFirstMove = true;
    }

    //

    calcLoopCapture(board, calc) {
        const ID = parseInt(this.brickId);
        let moveJump = ID + calc;

        for (let i = 1; i <= ChessPice.maxRange; i++) {
            // //console.log("searchong capture" + moveJump);
            if (chessGameGenerator.idIsInBoardRange(moveJump)) {
                let brickHasOpponentFig = this.isCaptureMove(board, moveJump);

                if (brickHasOpponentFig != null) {
                    return moveJump;
                } else if (
                    board[moveJump] != null &&
                    board[moveJump].color == this.color
                ) {
                    if (calc == 1 && this.brickId == 1) {
                        //console.log("WRONG");
                    }
                    break;
                }
                let g = chessGameGenerator;
                //TODO:
                let rightEndOfBoard_ =
                    calc == 1 && g.rightEndsOfBoard.includes(moveJump);
                let leftEndOfBoard_ =
                    calc == -1 && g.leftEndsOfBoard.includes(moveJump);
                let bottomEdOfBoard_ =
                    calc == 8 && g.bottomEndsOfBoard.includes(moveJump);
                let topEndOfBoard_ =
                    calc == -8 && g.rightEndsOfBoard.includes(moveJump);
                if (
                    rightEndOfBoard_ ||
                    leftEndOfBoard_ ||
                    topEndOfBoard_ ||
                    bottomEdOfBoard_
                )
                    break;

                moveJump += calc;
            } else return null;
        }
        return null;
    }
    calcIsAtEndOfBoard(calc, id) {
            let left = calc == -1 && chessGameGenerator.leftEndsOfBoard.includes(id);
            let right = calc == 1 && chessGameGenerator.rightEndsOfBoard.includes(id);
            let bottom = calc == 8 && chessGameGenerator.bottomEndsOfBoard.includes(id);
            let top = calc == -8 && chessGameGenerator.topEndsOfBoard.includes(id);

            return left || right || bottom || top;
        }
        //done
    getRegularMoves(board) {
            let moves = [];
            let idToTest = this.brickId;
            Rook.calcs.forEach((calc) => {
                if (!this.calcIsAtEndOfBoard(calc, this.brickId)) {
                    idToTest += calc;
                    for (
                        let i = 1; i <= ChessPice.maxRange; i++, idToTest = idToTest + calc
                    ) {
                        //console.log("id to test Rook" + idToTest);
                        let move = this.isRegularMove(board, idToTest);
                        //console.log("rook move result: " + move);
                        if (move != null) moves.push(move);
                        else break;

                        if (this.calcIsAtEndOfBoard(calc, idToTest)) {
                            break;
                        }
                    }
                    idToTest = this.brickId;
                }
            });

            //console.log("rook moves: " + moves);
            return moves;
        }
        //FIXME : no need to rewrite func

    getCaptureMoves(board) {
        let captures = [];
        Rook.calcs.forEach((calc) => {
            //console.log("ROOK_CAP_TEST");
            //console.log(calc + " ,,brick " + this.brickId);
            //console.log(!this.calcIsAtEndOfBoard(calc, this.brickId));
            if (!this.calcIsAtEndOfBoard(calc, this.brickId)) {
                //console.log("calcIN ROOK:");
                //console.log(calc);
                let capture = this.calcLoopCapture(board, calc);
                if (capture != null) captures.push(capture);
            }
        });
        return captures;
    }
}
class Knight extends ChessPice {
    static whiteUnicode = "&#9816;";
    static blackUnicode = "&#9822;";
    static calcs = [6, 10, 15, 17, -6, -10, -15, -17];
    constructor(color, type = "Knight") {
        super(color, type);
        this.letterSign = (color[0] + "N").toUpperCase();
        this.score = 3;
        this.icon = this.isWhite ? Knight.whiteUnicode : Knight.blackUnicode;
    }
    calcIsAtEndOfBoard(calc, id = this.brickId) {
            let test = false;
            let topEnds = chessGameGenerator.topEndsOfBoard;
            let bottomEnds = chessGameGenerator.bottomEndsOfBoard;
            let rightEnds = chessGameGenerator.rightEndsOfBoard;
            let rightEnds_2 = rightEnds.map((el) => el - 1);
            let leftEnds = chessGameGenerator.leftEndsOfBoard;
            let leftEnds_2 = leftEnds.map((el) => el + 1);

            switch (calc) {
                case -15:
                    if ((id >= 1 && id <= 16) || rightEnds.includes(id)) test = true;
                    break;
                case -17:
                    if ((id >= 1 && id <= 16) || leftEnds.includes(id)) test = true;
                    break;
                case 15:
                    if ((id >= 49 && id <= 64) || leftEnds.includes(id)) test = true;
                    break;
                case 17:
                    if ((id >= 49 && id <= 64) || rightEnds.includes(id)) test = true;
                    break;
                case -6:
                    if (
                        rightEnds.includes(id) ||
                        rightEnds_2.includes(id) ||
                        topEnds.includes(id)
                    )
                        test = true;
                    break;
                case 10:
                    if (
                        rightEnds.includes(id) ||
                        rightEnds_2.includes(id) ||
                        bottomEnds.includes(id)
                    )
                        test = true;
                    break;
                case -10:
                    if (
                        leftEnds.includes(id) ||
                        leftEnds_2.includes(id) ||
                        topEnds.includes(id)
                    )
                        test = true;
                    break;
                case 6:
                    if (
                        leftEnds.includes(id) ||
                        leftEnds_2.includes(id) ||
                        bottomEnds.includes(id)
                    )
                        test = true;
                    break;
            }
            return test;
        }
        //loop returns array
    getRegularMoves(board) {
        let moves = [];
        Knight.calcs.forEach((calc) => {
            if (!this.calcIsAtEndOfBoard(calc)) {
                let moveResult = this.isRegularMove(board, this.brickId + calc);
                if (moveResult != null) moves.push(moveResult);
            }
        });
        return moves;
    }
    getCaptureMoves(board) {
        let moves = [];
        Knight.calcs.forEach((calc) => {
            if (!this.calcIsAtEndOfBoard(calc)) {
                let moveResult = this.isCaptureMove(board, this.brickId + calc);
                if (moveResult != null) moves.push(moveResult);
            }
        });
        return moves;
    }
}
class Bishop extends ChessPice {
    static whiteUnicode = "&#9815;";
    static blackUnicode = "&#9821;";
    static calcs = [7, -7, 9, -9];
    constructor(color, type = "Bishop") {
        super(color, type);
        this.score = 3.25;
        this.icon = this.isWhite ? Bishop.whiteUnicode : Bishop.blackUnicode;
        this.firstMove = true;
    }
    calcIsAtEndOfBoard(calc, id) {
        // let leftTop = chessGameGenerator['leftEndsOfBoard'].includes(id)
        let leftTop =
            calc == -9 &&
            (chessGameGenerator.leftEndsOfBoard.includes(id) ||
                chessGameGenerator.topEndsOfBoard.includes(id));
        let leftBottom =
            calc == 7 &&
            (chessGameGenerator.leftEndsOfBoard.includes(id) ||
                chessGameGenerator.bottomEndsOfBoard.includes(id));
        let rightBottom =
            calc == 9 &&
            (chessGameGenerator.bottomEndsOfBoard.includes(id) ||
                chessGameGenerator.rightEndsOfBoard.includes(id));
        let rightTop =
            calc == -7 &&
            (chessGameGenerator.topEndsOfBoard.includes(id) ||
                chessGameGenerator.rightEndsOfBoard.includes(id));

        return leftTop || leftBottom || rightBottom || rightTop;
    }

    //loop returns array
    getRegularMoves(board) {
        let moves = [];

        Bishop.calcs.forEach((calc) => {
            for (let i = 1; i <= ChessPice.maxRange; i++) {
                let testId = this.brickId + calc * i;
                let moveResult = this.isRegularMove(board, testId);
                if (moveResult != null) {
                    if (!this.calcIsAtEndOfBoard(calc, this.brickId))
                        moves.push(moveResult);
                    else break;
                } else {
                    break;
                }
                if (chessGameGenerator.endOfBoard(testId)) break;
            }
        });
        return moves;
    }
    getCaptureMoves(board) {
        let captures = [];
        Bishop.calcs.forEach((calc) => {
            if (!this.calcIsAtEndOfBoard(calc, this, this.brickId)) {
                let capture = this.calcLoopCapture(calc, board);
                if (capture != null) captures.push(capture);
            }
        });
        return captures;
    }
    calcLoopCapture(calc, board) {
        const ID = parseInt(this.brickId);

        let moveJump = ID + calc;
        for (let i = 1; i <= ChessPice.maxRange; i++) {
            // //console.log("searchong capture" + moveJump);
            let brickHasOpponentFig = this.isCaptureMove(board, moveJump);

            if (brickHasOpponentFig != null) {
                return moveJump;
            } else if (board[moveJump] != null && board[moveJump].color == this.color)
                break;
            if (chessGameGenerator.endOfBoard(moveJump)) break;
            moveJump += calc;
        }
        return null;
    }
}
class King extends ChessPice {
    static whiteUnicode = "&#9812;";
    static blackUnicode = "&#9818;";
    static calcs = [7, -7, 9, -9, 1, -1, 8, -8];
    constructor(color, type = "King") {
        super(color, type);
        this.icon = this.isWhite ? King.whiteUnicode : King.blackUnicode;
        this.isFirstMove = true;
    }

    calcIsAtEndOfBoard(calc) {
        let left =
            (calc == 1 || calc == -7 || calc == 9) &&
            chessGameGenerator.leftEndsOfBoard.includes(this.brickId);
        let right =
            (calc == -9 || calc == -1 || calc == 7) &&
            chessGameGenerator.rightEndsOfBoard.includes(this.brickId);
        let top =
            (calc == -9 || calc == -8 || calc == -7) &&
            chessGameGenerator.topEndsOfBoard.includes(this.brickId);
        let bottom =
            (calc == 7 || calc == 8 || calc == 9) &&
            chessGameGenerator.bottomEndsOfBoard.includes(this.brickId);
        return left || right || top || bottom;
    }
    isCheck(board, position = this.brickId) {
            // let captures = [];
            for (let el of board) {
                if (el != null && el.color != this.color) {
                    //     let moves = el.getRegularMoves(boardObj);
                    let caps = el.getCaptureMoves(board);
                    //console.log("CHECK CAP MOVES for el");
                    //console.log(el);
                    //console.log(caps);
                    if (caps.includes(position)) return true;
                }
            }

            return false;
        }
        //!UNDONE
    isMate(board) {
        let kingMoves = [];

        kingMoves.push(this.getCaptureMoves(board));
        kingMoves.concat(this.getRegularMoves(board));

        return kingMoves.every((el) => this.isCheck(board, el));
    }

    getRegularMoves(board) {
        let moves = [];
        King.calcs.forEach((calc) => {
            if (!this.calcIsAtEndOfBoard(calc)) {
                let move = this.isRegularMove(board, this.brickId + calc);
                if (move != null) moves.push(move);
            }
        });

        return moves;
    }
    getCaptureMoves(board) {
        let moves = [];
        King.calcs.forEach((calc) => {
            if (!this.calcIsAtEndOfBoard(calc)) {
                let move = this.isCaptureMove(board, this.brickId + calc);

                if (move != null) moves.push(move);
            }
        });
        return moves;
    }
    getCastleMoves(boardObj) {
        //console.log("testing caslte");
        let moves = [];
        let canCastle = this.canCastleLeft_canCastleRight_arr(boardObj);
        //console.log(canCastle);
        if (canCastle.length == 2) {
            if (canCastle[0]) {
                moves.push(this.brickId - 2), moves.push(this.brickId - 4);
            }
            if (canCastle[1]) {
                moves.push(this.brickId + 2);
                moves.push(this.brickId + 3);
            }
        }
        //console.log("castleMoves" + moves);
        return moves;
    }
    canCastleLeft_canCastleRight_arr(boardObj) {
        let board = boardObj.board;
        if (this.isFirstMove && !this.isCheck(board)) {
            let leftRookPos = this.brickId - 4;
            let rightRookPos = this.brickId + 3;
            let leftRook, rightRook, leftSpaceIsFree, rightSpaceIsFree;
            let leftCastleIsAvailable = false;
            let rightCastleIsAvailable = false;
            let boardCopy;
            let lR = board[leftRookPos];
            leftRook = lR instanceof Rook && lR.isFirstMove ? lR : null;
            let rR = board[rightRookPos];
            rightRook =
                rR instanceof Rook && rR.isFirstMove ? board[rightRookPos] : null;
            //
            function testCastle(forwardToRookVal, kingId) {
                let castleIsAvailable = false;
                // let castleDir = forwardToRookVal ? 1 : -1;
                ////console.log("king:" + kingId);
                ////console.log(forwardToRookVal);
                let nextBrick = kingId - forwardToRookVal;
                let nextBrick2 = nextBrick - forwardToRookVal;
                nextBrick = Math.abs(nextBrick);
                nextBrick2 = Math.abs(nextBrick2);
                ////console.log("1 :" + nextBrick);
                ////console.log("2 :" + nextBrick2);
                ////console.log(forwardToRookVal);
                ////console.log(kingId + forwardToRookVal);
                let SpaceIsFree = board[nextBrick] == null && board[nextBrick2] == null;
                if (SpaceIsFree) {
                    boardObj.move(-kingId, nextBrick);
                    ////console.log(board[nextBrick]);
                    if (!board[nextBrick].isCheck(board)) {
                        boardObj.move(nextBrick, nextBrick2);
                        castleIsAvailable = !board[nextBrick2].isCheck(board);
                        boardObj.move(nextBrick2, -kingId);
                    } else {
                        boardObj.move(nextBrick2, -kingId);
                    }
                    board[-kingId].isFirstMove = true;
                }
                return castleIsAvailable;
            }
            if (rightRook != null) {
                rightCastleIsAvailable = testCastle(1, -this.brickId);
            }
            if (leftRook != null) {
                leftCastleIsAvailable = testCastle(-1, -this.brickId);
            }

            return [leftCastleIsAvailable, rightCastleIsAvailable];
        } else return [false, false];
    }
}
class Queen extends ChessPice {
    static whiteUnicode = "&#9813;";
    static blackUnicode = "&#9819;";
    constructor(color, type = "Queen") {
        super(color, type);
        this.score += 9;
        this.icon = this.isWhite ? Queen.whiteUnicode : Queen.blackUnicode;
    }

    setRook(id) {
        let rook = new Rook(this.color);
        rook.setBrickId(id);
        return rook;
    }
    setBishop(id) {
        let rook = new Bishop(this.color);
        rook.setBrickId(id);
        return rook;
    }
    getRegularMoves(board) {
        //console.log("QUEENTEST");
        let rook = this.setRook(this.brickId);
        let bishop = this.setBishop(this.brickId);
        let bishopMoves = bishop.getRegularMoves(board);
        let rookMoves = rook.getRegularMoves(board);
        return bishopMoves.concat(rookMoves);
    }
    getCaptureMoves(board) {
        let rook = this.setRook(this.brickId);
        let bishop = this.setBishop(this.brickId);
        let bishopMoves = bishop.getCaptureMoves(board);
        let rookMoves = rook.getCaptureMoves(board);
        return bishopMoves.concat(rookMoves);
    }
}