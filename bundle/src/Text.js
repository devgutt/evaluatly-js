import { data } from "./Data";

export function processText(str) {
    let txt = processVariables(str);
    txt = processFormating(txt);
    return txt;
}

export function processFormating(str) {

    if (str === undefined) return "";

    const regTop = /(\*\*?|__?|~~|[<>\r\n])|\[([^[]*)\]\(([^(]*)\)/g;

    const closeTag = {};
    const renderTag = tag => {
        if (!closeTag[tag]) {
            closeTag[tag] = true;
            return "<" + tag + ">";
        } else {
            closeTag[tag] = false;
            return "</" + tag + ">";
        }
    };

    return str.replace(regTop, (m, cmd, linkName, linkUrl) => {

        if (cmd) {
            if (cmd == '**' || cmd == '__') {
                return renderTag('strong');
            } else if (cmd == '*' || cmd == '_') {
                return renderTag('em');
            } else if (cmd == '~~') {
                return renderTag('del');
            } else if (cmd == '>') {
                return "&gt;";
            } else if (cmd == '<') {
                return "&lt;";
            } else if (cmd == '\n') {
                return "<br>";
            } else {
                return "";
            }
        } else if (linkName) {
            return "<a href='" + linkUrl + "' class='a_ic theme_link' target=_blank rel='noreferrer noopener'>" + linkName + "</a>"
        } else {
            return "";
        }
    })
}

export function processVariables(str) {

    if (str === undefined || typeof str != 'string') return "";
    if (!str.includes('{{')) return str;

    const regTop = /{{(\w+)(?:\.(\w+))?(?:\|(.*?))?}}/g;

    return str.replace(regTop, (m, key, prop, fn) => {

        let txt = (data.get(key, prop || "value") || "") + "";

        if (fn) {
            const regFn = /(\w+)(?:\(((?:(?:'[^']*'|[0-9]+)[\s,]*)*)\))?\|?/g;
            let match;
            while ((match = regFn.exec(fn)) !== null) {
                try {
                    txt = processFn(match[1], txt, match[2]);
                } catch (e) {
                    console.error("Error processing function: ", match[1], e);
                    break;
                }
            }
        }

        return txt;
    })
}

function processFn(fn, txt, par) {

    par = par && par.match(/'[^']*'|[0-9]+/g) || [];
    const g = index => par[index] && par[index].replace(/'/g, '') || "";

    switch (fn) {
        case 'upper': return txt.toUpperCase();
        case 'lower': return txt.toLowerCase();
        case 'sub': return txt.substring(g(0), g(1) == "" ? undefined : g(1));
        
        case 'equal': return txt == g(0) ? g(1) : g(2);
        case 'notEqual': return txt != g(0) ? g(1) : g(2);
        case 'less': return txt < g(0) ? g(1) : g(2);
        case 'lessEqual': return txt <= g(0) ? g(1) : g(2);
        case 'greater': return txt > g(0) ? g(1) : g(2);
        case 'greaterEqual': return txt >= g(0) ? g(1) : g(2);

        case 'default': return txt !== "" && txt !== undefined ? txt : g(0);
        case 'first': return getElement(txt, " ", 0);
        case 'last': return getElement(txt, " ", 0, true);
        case 'word': return getElement(txt, " ", g(0));
        default: 
            console.error("Function not found: ", fn);
            return txt;
    }
}

function getElement(str, delimiter, index, reverse) {
    if (str !== undefined) {
        const arr = (str + "").trim().split(delimiter);
        const i = reverse ? arr.length - index - 1 : index;
        return arr[i] !== undefined ? arr[i] : "";
    }
    return "";
}
