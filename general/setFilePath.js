const StyleFiles = ["general.css", "board.css", "game.css", "chat.css"];
const ScriptFiles = ["interface.js", "pieces.js", "gameplay.js", "script.js"];

const CSS_PATH = "css/";
const JS_PATH = "js/";

const HEAD = document.querySelector("head");
const BODY = document.querySelector("body");

function appendFiles(files, filePath, section, type) {
    files.forEach((file) => {
        let path = filePath + file;
        let el;
        if (type == "link") {
            el = document.createElement(type);
            el.setAttribute("rel", "stylesheet");
            el.setAttribute("href", path);
        } else if (type == "script") {
            el = document.createElement("script");
            el.setAttribute("src", path);
        }
        section.append(el);
    });
}

//appendFiles(ScriptFiles, JS_PATH, BODY, "script");
appendFiles(StyleFiles, CSS_PATH, HEAD, "link");