import { hr, div } from '../Html';
import { runProgramObject } from '../Program';

export default function ItemSeparator(parent, item, control) {

    const e = getElement(item, control);

    e && parent.appendChild(e);
}

function getElement(item, control) {

    const style = runProgramObject(item.style, control);

    if (item.type == "line") {
        return hr({ class: "hr_is theme_line", style: style })
    } else if (item.type == "space") {
        return div({ class: "div_is theme_space", style: style })
    } else {
        return null
    }

}
