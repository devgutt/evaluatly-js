import { processText } from '../Text';
import { h1, h2, p, pre } from '../Html';
import { runProgramObject } from '../Program';

export default function ItemText(parent, item, control) {
    const e = getElement(item, control);
    e && parent.appendChild(e);
}

function getElement(item, control) {

    const style = runProgramObject(item.style, control);

    switch (item.type) {
        case 'title':
            return h1({ class: "h1_it _at theme_title", innerHTML: processText(item.value), style: style });
        case 'subtitle':
            return h2({ class: "h2_it _at theme_subtitle", innerHTML: processText(item.value), style: style });
        case 'question':
            return p({ class: "question p_it _at theme_question", innerHTML: processText(item.value), style: style });
        case 'p':
            return Paragraph(item, style);
        case 'code':
            return pre({ class: "pre_it theme_code", innerHTML: processText(item.value), style: style });
    }
    return null;
}

function Paragraph(item, style) {
    if (Array.isArray(item.value)) {
        const ps = new DocumentFragment();
        item.value.forEach(value => {
            ps.appendChild(p({ class: "p_it _at theme_p", innerHTML: processText(value), style: style }));
        });
        return ps;
    } else if (item.value !== undefined) {
        return p({ class: "p_it _at theme_p", innerHTML: processText(item.value), style: style });
    } else {
        return null;
    }
}
