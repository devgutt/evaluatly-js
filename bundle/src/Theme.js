import initial from './css/main.scss'

const LOADED_FONTS = [];

export function processTheme(root, theme) {

    createStyleHead(root, initial);
    createEvaluatlyFont();

    let style = "";

    for (let group in theme) {
        style += foldStyle(".theme_" + group, theme[group]) + "\n";
    }

    createStyleHead(root, style);
}

function foldStyle(group, style) {

    if (!style) return "";

    let r = "";
    for (let key in style) {
        let v = style[key];
        if (key == 'font-family') {
            const fn = processFont(v);
            if (fn) {
                v = fn;
            }
        }
        r += key + ":" + v + ";";
    }

    return ".evaluatly " + group + "{ " + r + " }";
}

function createStyleHead(root, textContent) {
    const s = document.createElement('style');
    if (textContent) {
        s.textContent = textContent;
    }
    root.appendChild(s);
    return s;
}

function processFont(fontFamily) {

    if (!fontFamily) return null;

    const i = fontFamily.indexOf(":");

    if (i > -1) {
        const type = fontFamily.substring(0, i).toLowerCase().trim();
        const name = fontFamily.substring(i+1).trim();

        if (type === 'google') {
            const f = name.replace(/ /gi, '+') + ":400,700";
            const link = "https://fonts.googleapis.com/css?family=" + f + "&display=swap";

            loadFont(name, link, 'text/css', 'stylesheet');

            return name;
        }
    }
}

function loadFont(name, link, type, rel) {

    if (LOADED_FONTS.indexOf(name) === -1) {
        createLinkHead(link, type, rel);
        LOADED_FONTS.push(name);
    }
}

function createLinkHead(href, type, rel) {
    if (!href) return;
    const s = document.createElement('link');
    s.href = href;
    if (type) s.type = type;
    if (rel) s.rel = rel;
    document.head.appendChild(s);
}

function createEvaluatlyFont() {
    loadFont('evaluatly', 'https://fonts.googleapis.com/css?family=Pacifico&display=swap&text=evaluatly', 'text/css', 'stylesheet');
}