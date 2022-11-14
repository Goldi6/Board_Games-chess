class Conversion {
    fromHexToUnicode(val) {
        //like hex chess piece : "2659"
        return String.fromCharCode(parseInt(val, 16));
    }

    getRootPseudo_var(variable) {
        let root = document.querySelector(":root");
        return getComputedStyle(root).getPropertyValue(variable);
    }
    setRootPseudo_var(variable, value) {
        let root = document.querySelector(":root");
        root.style.setProperty(variable, value);
    }
}