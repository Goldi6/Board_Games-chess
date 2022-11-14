class GameMessages {
    static drawAnswer(ans) {
        if (ans) {
            return "Opponent accepted Draw!";
        } else {
            return "Opponent did not accept a Draw!\nGame Goes On!";
        }
    }
    static confirmQuestion(msg) {
        return "are you sure " + msg;
    }
    static confirmResign() {
        return this.confirmQuestion("you want to resign?");
    }
    static confirmDraw() {
        return "your opponent is asking for a draw!\nwilling to confirm?";
    }
}