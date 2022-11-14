class ChessBoardCloner {
    isArrayOfObj(obj) {
            if (
                Array.isArray(obj) &&
                obj.some((el) => {
                    return el instanceof Object;
                })
            ) {
                // //console.log(obj);
                return true;
            } else return false;
        }
        /////
    isArrayOfClonedObj(obj) {
        //    //console.log(Obj);
        if (
            Array.isArray(obj) &&
            obj.some((el) => {
                return el instanceof Object && el.hasOwnProperty("clone");
            })
        )
            return true;
        else return false;
    }

    ///////
    ///////////
    ////////////
    //TODO instead of setting CUSTOM BOARD var use const and revert from duplicate board
    //!unused
    revertFromClone(obj) {
        for (let key in obj.clone) {
            // //console.log(key);
            obj[key] = obj.clone[key];
            return obj;
        }
    }
    revertObjArrayFromClone(arr) {
        let reverted = arr.map((obj) => {
            let arr = this.revertFromClone(obj);
            return arr;
        });
        return reverted;
    }
    revertThisFromClone(DuplicatedObj) {
        // let values = Object.values(this);
        let keys = Object.keys(this);
        for (let key of keys) {
            // //console.log(key);
            // //console.log(this[key]);
            if (key != "itself" && this.isArrayOfClonedObj(this[key])) {
                this[key] = this.revertObjArrayFromClone(this[key]);
            } else this[key] = this.clone[key];
        }
    }

    /////////////
    ////////////
    /////////////
    removeCloneFromThis() {
        delete this.clone;
    }
    resetThisClone() {
        this.clone = {};
    }

    setThisDeepClone(boardObj) {
        //console.log("DEEP CLONING");
        boardObj.itself = boardObj;
        boardObj.clone = structuredClone(this); //the built in cloning method
    }
    revertItemFromClone(item, clone) {
        let keys = Object.keys(clone);
        if (item) {
            keys.forEach((key) => {
                item[key] = clone[key];
            });
        }

        return item;
    }
    setDuplicateBoard(newClass = new chessGameGenerator()) {
            let clone = this.clone;
            let newBoard = newClass;
            // let values = Object.values(copy);
            let keys = Object.keys(clone);
            for (let key of keys) {
                // //console.log(this[key]);
                if (key != "itself" && this.isArrayOfObj(clone[key])) {
                    let obs = clone[key];
                    newBoard[key] = obs.map((clonedPiece) => {
                        let type = clonedPiece.type;
                        type = type.toLowerCase();
                        let el;
                        // //console.log("aaaaaa");
                        // //console.log(type);
                        switch (type) {
                            case "chessPice":
                                el = new ChessPice(clonedPiece.color);
                                break;
                            case "pawn":
                                el = new Pawn(clonedPiece.color);
                                break;
                            case "rook":
                                el = new Rook(clonedPiece.color);
                                break;
                            case "knight":
                                el = new Knight(clonedPiece.color);
                                break;
                            case "bishop":
                                el = new Bishop(clonedPiece.color);
                                break;
                            case "queen":
                                el = new Queen(clonedPiece.color);
                                break;
                            case "king":
                                el = new King(clonedPiece.color);
                                break;
                            default:
                                el = null;
                                break;
                        }
                        return this.revertItemFromClone(el, clonedPiece);
                    });
                    // //console.log(newBoard[key]);
                } else {
                    if (key != "itself") newBoard[key] = this.clone[key];
                }
            }
            return newBoard;
        }
        /////////////////

    setCloneForThis() {
        let keys = Object.keys(this);
        this.clone = {};
        for (let key of keys) {
            //  //console.log(val);
            if (this.isArrayOfObj(this[key])) {
                // //console.log(this[key]);
                let arr = this.createArrayInnerClones(this[key]);
                // //console.log("ppppp");
                // //console.log(this);
                this.clone[key] = arr;
                // //console.log(arr);
            } else {
                // //console.log(this);

                this.clone[key] = this[key];
            }
        }

        //!
        // this.itself = this;
        // this.clone = structuredClone(this); //the built in cloning method
        //!
    }

    createArrayInnerClones(arr) {
        ////console.log("the array");
        // //console.log(arr);
        let newArr = [];

        for (let i = 1; i <= 64; i++) {
            if (arr[i] instanceof ChessPice) {
                newArr[i] = this.setCloneToObj(arr[i]);
            }
        }

        // arr.forEach((el) => {
        //     if (el instanceof ChessPice) {
        //         newArr.push(this.setCloneToObj(el));
        //     } else {
        //         //console.log("EMPTY");
        //         newArr.push(null);
        //     }
        // });

        // //console.log("aaa");
        // //console.log(newArr);
        return newArr;
    }

    setCloneToObj(el) {
        let keys = Object.keys(el);
        const clone = {};

        keys.forEach((key) => {
            clone[key] = el[key];
        });
        return clone;
    }

    //////////////

    static activeGames = 0;
    static maxPiecesForEachSide = 16;

    constructor() {
        this.board = [];
        this.playerIsWhite = true;
        this.blackFigs = 0;
        this.whiteFigs = 0;
        this.blackScore = 0;
        this.whiteScore = 0;
        this.activeGame = false;
        this.figToMove = null;
        this.playerWill = null;
        this.blackKingId = -1;
        this.whiteKingId = -1;
        this.lastBoardCopy = [];
        this.boardHistory = [];
        this.blackHistory = [];
        this.whiteHistory = [];
        this.noCaptureTimes = 0;
        this.noPawnMoved = 0;
        this.whiteThreeFold = false;
        this.blackThreeFold = false;
        this.availableCastlingToMake = [];
        this.availableEnPassantToMake = [];
        //?
    }

    resetBoard() {
        this.board = [];
        this.playerIsWhite = true;
        this.blackFigs = 0;
        this.whiteFigs = 0;
        this.blackScore = 0;
        this.whiteScore = 0;
        this.activeGame = false;
        //this.gameStarted = false;
        //?
        this.figToMove = null;
        this.playerWill = null;
        this.blackKingId = -1;
        this.whiteKingId = -1;
        // this.lastBoardCopy = [];
        this.boardHistory = [];
        this.blackHistory = [];
        this.whiteHistory = [];
        this.noCaptureTimes = 0;
        this.noPawnMoved = 0;
        this.whiteThreeFold = false;
        this.blackThreeFold = false;
    }
    setDefaultChessBoard = () => {
        this.resetBoard();
        let board = [];

        for (let i = 9; i <= 16; i++) {
            board[i] = new Pawn("black");
            board[i].setBrickId(i);
        }
        for (let i = 49; i <= 56; i++) {
            board[i] = new Pawn("white");
            board[i].setBrickId(i);
        }
        board[1] = new Rook("black");
        board[1].setBrickId(1);
        board[8] = new Rook("black");
        board[8].setBrickId(8);
        ///
        board[64] = new Rook("white");
        board[64].setBrickId(64);
        board[57] = new Rook("white");
        board[57].setBrickId(57);
        //
        board[2] = new Knight("black");
        board[2].setBrickId(2);
        board[7] = new Knight("black");
        board[7].setBrickId(7);
        ///
        board[63] = new Knight("white");
        board[63].setBrickId(63);
        board[58] = new Knight("white");
        board[58].setBrickId(58);
        ///
        board[3] = new Bishop("black");
        board[3].setBrickId(3);
        board[6] = new Bishop("black");
        board[6].setBrickId(6);
        ///
        board[62] = new Bishop("white");
        board[62].setBrickId(62);
        board[59] = new Bishop("white");
        board[59].setBrickId(59);
        ///
        board[4] = new Queen("black");
        board[4].setBrickId(4);
        board[5] = new King("black");
        board[5].setBrickId(5);
        ///
        board[61] = new King("white");
        board[61].setBrickId(61);
        board[60] = new Queen("white");
        board[60].setBrickId(60);
        this.whiteFigs = 16;
        this.blackFigs = 16;
        this.board = board;
        this.blackKingId = 5;
        this.whiteKingId = 61;
    };

    //////////////
    //STATIC HELPERS
    //!!!!!!!!!!!!
    //#region static helpers
    static idIsInBoardRange(brick) {
        return brick > 0 && brick <= 64;
    }
    static endOfBoard(id) {
        let endOfBoardBrocks = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 17, 25, 33, 41, 49, 57, 58, 59, 60, 61, 62, 63,
            64, 16, 24, 32, 40, 48, 56,
        ];
        return endOfBoardBrocks.includes(id);
    }
    static leftEndsOfBoard = [1, 9, 17, 25, 33, 41, 49, 57];
    static rightEndsOfBoard = [8, 16, 24, 32, 40, 48, 56, 64];
    static bottomEndsOfBoard = [57, 58, 59, 60, 61, 62, 63, 64];
    static topEndsOfBoard = [1, 2, 3, 4, 5, 6, 7, 8];
    //#endregion
    //#region GUI
    static generateGuiFigureElement(figObj) {
        const fig = document.createElement("span");
        fig.classList.add("chess-piece", figObj.color, figObj.type);
        // fig.innerHTML = figObj.letterSign;
        fig.innerHTML = figObj.icon;
        fig.setAttribute(
            "id", !figObj.getBrickId() ? "" : "_" + figObj.getBrickId()
        );
        return fig;
    }
    placeFiguresOnGuiBoard() {
            this.board.forEach((obj) => {
                let figElem = chessGameGenerator.generateGuiFigureElement(obj);
                document.getElementById("brick_" + obj.getBrickId()).appendChild(figElem);
            });
        }
        // !GUI
        //#endregion
}