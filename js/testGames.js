function play(movesArray) {
    alert("playing game!");
    movesArray.forEach((move) => {
        let from = move[0];
        let to = move[1];
        let fig = document.getElementById("brick_" + from);
        console.log(fig);
        let mov = document.getElementById("brick_" + to);

        fig.click();
        alert("nextMove");
        mov.click();
        alert("nextMove");
    });
}
const foolsCheckMate = [
    [54, 46],
    [13, 29],
    [55, 39],
    [4, 40],
];

// let foolsCheckMate_btn = document.getElementById("fools-checkmate");
// console.log(foolsCheckMate_btn);
// foolsCheckMate_btn.addEventListener("click", () => {
//     play(foolsCheckMate);
// });