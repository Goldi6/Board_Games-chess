//brick refers to squares on the board
//TODO: set moves at each board check and remove this test on each click *include anPassant and castling
//TODO; revert bricks count
class chessGameGenerator extends ChessBoardCloner {
    constructor() {
        super();
    }

    /////
    //#region board setters
    //!unused
    setKingIdIfKingEl(el) {
        let isKing = el instanceof King;
        if (isKing && el.color == "white") this.whiteKingId = el.getBrickId();
        if (isKing && el.color == "black") this.blackKingId = el.getBrickId();
    }

    customGameCanStart = () => {
        if (this.board.length > 1 && this.blackFigs > 0 && this.whiteFigs > 0) {
            return true;
        } else return false;
    };

    //#endregion

    //#region Draws
    /////////////
    fiftyRuleMoveOccur() {
        console.log("CHECKING 50 RULE");
        console.log(this.noCaptureTimes);
        console.log(this.noPawnMoved);
        return this.noPawnMoved >= 50 && this.noCaptureTimes >= 50;
        //no pawn was moved
        //no capture
    }
    threeFoldRepetition_() {
        let h = this.boardHistory;
        let stringH = [];
        for (let i = 0; i < h.length; i++) {
            stringH[i] = h[i].join();
        }

        //            console.log(stringH);

        function getMaxRepetitions(arr) {
            let lastIndx = arr.length - 1;
            let max = 0;
            arr.forEach((el, index) => {
                let i = index;
                let times = 0;
                while (index < lastIndx) {
                    index++;
                    //                      console.log("REPETITION CHECK");
                    //                        console.log(el);
                    //console.log(arr[index]);
                    if (compare(el, arr[index])) times++;
                }
                max = max > times ? max : times;
            });
            return max;
        }

        function compare(a, b) {
            if (a.length != b.length) return false;

            if (a == b) return true;
        }

        let atLeast3Repetitions = false;
        if (h.length > 3) atLeast3Repetitions = getMaxRepetitions(stringH) >= 3;
        return atLeast3Repetitions;
    }

    deadPosition() {
        //console.log("INSUFFF");

        let amountOfFigs = this.whiteFigs + this.blackFigs;
        if (amountOfFigs == 2) {
            // boardHistory;
            return true;
        } else if (amountOfFigs == 3) {
            //console.log(amountOfFigs);
            let figs = [];
            this.board.forEach((el) => {
                if (
                    el != null &&
                    (el instanceof King || el instanceof Knight || el instanceof Bishop)
                )
                    figs.push(el);
            });
            if (figs.length == 3) return true;
        } else return false;
    }

    //////////////

    ////////////////
    ////////////

    //#region moves
    move(figPos, movePos) {
        //console.log("playing MOVE!");
        //console.log("this.board");
        //console.log(this.board);
        //console.log("fig " + figPos);
        //console.log("move " + movePos);
        ////console.log(this.board[figPos]);
        this.board[movePos] = this.board[figPos];
        ////console.log(this.board[figPos]);
        // //console.log("piece that moved : ");
        ////console.log(this.board[movePos]);
        // //console.log(this.board[movePos]);
        this.board[movePos].setBrickId(movePos);
        if (
            this.board[movePos].hasOwnProperty("isFirstMove") &&
            this.board[movePos].isFirstMove
        ) {
            this.board[movePos].setFirstMoveWasMade(figPos, movePos);
        }
        this.board[figPos] = null;
        this.setKingIdIfKingEl(this.board[movePos]);
        ////console.log("what left ");
        ////console.log(this.board[figPos]);
    }

    capture(figPos, capturePos) {
        let score = this.board[capturePos].score;
        //console.log("FIGSCORE");
        //console.log(score);
        if (this.board[figPos].color === "white") {
            this.whiteScore += score;
            this.blackFigs--;
        }
        if (this.board[figPos].color === "black") {
            this.blackScore += score;
            this.whiteFigs--;
        }
        this.move(figPos, capturePos);
    }
    enPassant(figPos, movePos, capPos) {
        //console.log("PASSANT capPos:" + capPos);
        let score = this.board[capPos].score;
        if (this.board[figPos].color === "white") {
            this.whiteScore += score;
            this.blackFigs--;
        }
        if (this.board[figPos].color === "black") {
            this.blackScore += score;
            this.whiteFigs--;
        }
        this.move(figPos, movePos);
        this.board[capPos] = null;
    }
    castle(kingPos, movePos) {
        let castleToRight = movePos > kingPos;
        let castlingKing = castleToRight ? kingPos + 2 : kingPos - 2;
        let rookCastling = castleToRight ? kingPos + 1 : kingPos - 1;
        let rookPos = castleToRight ? kingPos + 3 : kingPos - 4;
        this.move(kingPos, castlingKing);
        // //console.log(this.board[rookPos]);
        ////console.log(rookCastling);
        this.move(rookPos, rookCastling);
    }

    //#endregion

    ////////////
    /////////////
    //////////
    // #region turn play
    //makes the move
    playTurnTo(move_id) {
            //////

            let result = "";
            //console.log("ZZZZZZZZZZZZZZZZZZZZZzz");
            //console.log(this.playerWill);
            switch (this.playerWill) {
                case "castle":
                    this.castle(this.figToMove.getBrickId(), move_id);
                    //console.log("king castle!");
                    this.noCaptureTimes++;

                    result = "castle";
                    break;

                case "capture":
                    this.capture(this.figToMove.getBrickId(), move_id);
                    //console.log("piece was captured!");
                    this.noCaptureTimes = 0;

                    result = "capture";
                    break;
                case "move":
                    // //console.log(this.figToMove.getBrickId());
                    this.move(this.figToMove.getBrickId(), move_id);
                    //console.log("piece moved!");
                    this.noCaptureTimes++;

                    result = "move";
                    break;
                case "enPassant":
                    this.noCaptureTimes = 0;
                    let calc = 8 * this.figToMove.forwardCalc;
                    let cap = move_id - calc;
                    this.enPassant(this.figToMove.getBrickId(), move_id, cap);
                    //console.log("EN PASSSS");

                    result = "enPassant_" + cap;
                    break;
            }

            //////

            if (this.board[move_id] instanceof Pawn) {
                if (
                    chessGameGenerator.bottomEndsOfBoard.includes(move_id) ||
                    chessGameGenerator.topEndsOfBoard.includes(move_id)
                ) {
                    result += "__pawnUpgrade";
                }
                /////
                this.noPawnMoved = 0;
            } else this.noPawnMoved++;
            ////
            return result;
            //////
        }
        //////////////

    endTurn() {
        //console.log("ENDING TURN");
        //console.log("QQQQQQQQQQQQQQQQQQ");
        //console.log("PAWNMOVED : " + this.noPawnMoved);
        //console.log("CAPMOVES : " + this.noCaptureTimes);
        this.figToMove = null;
        this.availableMovesToMake = [];
        this.availableCapturesToMake = [];
        this.availableEnPassantToMake = [];
        this.availableCastlingToMake = [];
        this.playerWill = "";
        this.playerIsWhite = !this.playerIsWhite;
        this.prepareBoardForTests();
    }

    upgradePawn(upgrade, id) {
        //console.log("UPGRADEPAWN");
        //console.log(upgrade);
        //console.log(id);
        let fig;
        let color = this.board[id].color;
        switch (upgrade) {
            case "queen":
                fig = new Queen(color);
                break;
            case "bishop":
                fig = new Bishop(color);
                break;
            case "knight":
                fig = new Knight(color);
                break;
            case "rook":
                fig = new Rook(color);
                fig.isFirstMove = false;
                break;
            default:
                fig = this.board[id];
        }
        fig.setBrickId(id);
        //console.log(fig);
        this.board[id] = fig;
        return true;
    }

    //#endregion

    ///////
    //#region board status
    /////

    checkBoardStatus() {
        //console.log("ttttttttttttttttttt");
        let stat = "turn";
        let kingId = this.playerIsWhite ? this.whiteKingId : this.blackKingId;
        let check = this.board[kingId].isCheck(this.board);
        //console.log("KING_CHECK_STAT:" + check);
        let mate = this.thereAreNoLegalMoves();
        ////
        //this.threeFoldRepetitionOccur();
        // debugger;
        ////
        if (check) {
            stat = "check";

            // let mate = this.board[kingId].isMate(this.board);
            //console.log(mate + " result");
            if (mate) stat += "mate";
        } else {
            if (mate) {
                stat = "stalemate";
            } else if (this.fiftyRuleMoveOccur()) {
                stat = "50 Rule Draw";
                //  } else if (this.blackThreeFold && this.whiteThreeFold) {
            } else if (this.threeFoldRepetition_()) {
                stat = "Three Fold Draw";
            } else if (this.deadPosition()) {
                stat = "insufficient Material";
            }
        }
        return stat;
    }

    ///////////
    thereAreNoLegalMoves() {
            //console.log("CHECKING IF NO LEGAL MOVES");
            let possibilities = [];
            this.board.forEach((el) => {
                ////console.log(el);
                if (el != null && this.playerIsWhite == el.isWhite) {
                    //console.log("CHECKING :this EL");
                    //console.log(el);

                    possibilities.push(this.setFigToMove(el.getBrickId()));
                }
            });
            //  //console.log(possibilities);
            return possibilities.every((el) => !el);
        }
        ////////////
        //#endregion
        ///////
        //////

    //#region prep for testing before making a move
    prepareBoardForTests() {
        //console.log("PREPARING BOARD");
        this.pushBoardToHistory();
        // this.setBoardCopy(this.boardHistory);
        //  //console.log(this.lastBoardCopy);
        //console.log("RRRRRRRRRRTEST");
        //console.log("SETTING CLONE");
        this.setCloneForThis();
        //console.log("GGGGGGGGGGGGggggg");
        //console.log("DUPLICATING BOARD");
        this.lastBoardCopy = this.setDuplicateBoard();
        //console.log("DUPLICATE BOARD LOG");
        //console.log(this.lastBoardCopy);
    }

    pushBoardToHistory() {
        //console.log("AAAAAAAAAAAAAPUSH_BOARD_TO_HISTORY");
        let history = [undefined];
        let whiteHistory = {};
        let blackHistory = {};
        for (let i = 1; i <= 64; i++) {
            if (this.board[i] != null) {
                let fig = this.board[i];
                history.push(fig.letterSign);
                if (!this.playerIsWhite && fig.color == "white")
                    whiteHistory[i] = fig.letterSign;
                if (this.playerIsWhite && fig.color == "black")
                    blackHistory[i] = fig.letterSign;
            } else {
                history.push(" ");
            }
        }
        this.boardHistory.push(history);
        if (Object.keys(blackHistory).length > 0)
            this.blackHistory.push(blackHistory);
        if (Object.keys(whiteHistory).length > 0)
            this.whiteHistory.push(whiteHistory);
        //        //console.log(this.blackHistory);
        //console.log(this.whiteHistory);
    }

    //#endregion

    //#region input setters
    setFigToMove(id) {
        //console.log("SETTING FIG");
        //TODO check canMove() *remove unnecessary loop
        if (this.board[id].canMove(this)) {
            //console.log("THIS.BOARD after .canMove() test");
            //console.log(this.board);
            this.figToMove = this.board[id];
            this.availableMovesToMake = this.figToMove.legalMoves;
            this.availableCapturesToMake = this.figToMove.legalCaptures;
            if (this.figToMove instanceof King) {
                this.availableCastlingToMake = this.figToMove.getCastleMoves(this);
            }
            this.availableEnPassantToMake = [];
            this.availableEnPassant = [];
            if (this.figToMove instanceof Pawn) {
                let enPassantMoves = this.figToMove.getEnPassantMoves(this.board);
                //console.log("EN PASSANT moves");
                //console.log(enPassantMoves);
                if (enPassantMoves.length > 0) {
                    let history = this.playerIsWhite ?
                        this.blackHistory :
                        this.whiteHistory;
                    if (history.length > 2) {
                        let his_1 = history[history.length - 1];
                        let his_2 = history[history.length - 2];
                        let calc = this.figToMove.forwardCalc;
                        // //console.log(history);
                        // //console.log(his_1);
                        // //console.log(his_2);
                        enPassantMoves.forEach((mov) => {
                            let capId = mov.capture;
                            if (his_1.hasOwnProperty(capId)) {
                                let capIdBefore = Math.abs(capId + 16 * calc);
                                if (his_2.hasOwnProperty(capIdBefore)) {
                                    let compare1 = his_1[capId];
                                    let compare2 = his_2[capIdBefore] + "m";

                                    if (compare1 == compare2) {
                                        this.availableEnPassantToMake.push(mov.move);
                                        this.availableEnPassant.push(mov);
                                    }
                                }
                            }
                        });
                    }
                }
            }

            return true;
        }
        return false;
    }
    setBrickToMakeTheMoveTo(id) {
            //console.log("DDDDDDDDDDDD");
            //console.log(this.availableEnPassantToMake);

            if (this.figToMove != null) {
                ////console.log("moving piece already been set");
                // //console.log(this.figToMove instanceof King);
                if (
                    this.figToMove instanceof Pawn &&
                    this.availableEnPassantToMake.includes(id)
                ) {
                    this.playerWill = "enPassant";
                    return true;
                } else if (
                    this.figToMove instanceof King &&
                    this.availableCastlingToMake.includes(id)
                ) {
                    this.playerWill = "castle";
                    return true;
                } else if (this.availableMovesToMake.includes(id)) {
                    //console.log("available moves are: " + this.availableMovesToMake);
                    //console.log(id + " is available");

                    this.playerWill = "move";

                    return true;
                } else if (this.availableCapturesToMake.includes(id)) {
                    this.playerWill = "capture";
                    return true;
                } else return false;
            } else return false;
        }
        //#endregion
        /////
        ////////////////////

    /////

    /////
}

class CustomChessGameGenerator extends chessGameGenerator {
    constructor() {
        super();
    }

    setKingsFromCustomBoard() {
        for (let el of this.board) {
            if (this.blackKingId < 0 || this.whiteKingId < 0) {
                this.setKingIdIfKingEl(el);
            }
        }
    }
}