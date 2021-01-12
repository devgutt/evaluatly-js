export const
    h1 = f('h1'),
    h2 = f('h2'),
    h3 = f('h3'),
    h4 = f('h4'),
    h5 = f('h5'),
    p = f('p'),
    span = f('span'),
    button = f('button'),
    div = f('div'),
    a = f('a'),
    pre = f('pre'),
    img = f('img'),
    hr = f('hr'),
    labl = f('label'),
    form = f('form'),
    input = f('input'),
    textarea = f('textarea'),
    iframe = f('iframe'),
    section = f('section'),
    svg = f('svg'),
    path = f('path');

function f(type) {
    return (attrs, children) => el(type, attrs, children);
}

export function el(type, attrs, children) {
    const e = createElement(type);
    for (var attr in attrs) {
        const value = attrs[attr];
        if (attr == 'style') {
            for (var st in value) {
                if (value[st] !== undefined) {
                    e.style[st] = value[st];
                }
            }
        } else if (attr == 'innerHTML') {
            e.innerHTML = value;
        } else if (attr == 'onClick') {
            e.addEventListener('click', value);
        } else if (attr == 'onSubmit') {
            e.addEventListener('submit', value);
        } else if (attr == 'onChange') {
            e.addEventListener('input', value);
        } else {
            if (value !== undefined && value !== null ) {
                e.setAttribute(attr, value);
            }
        }
    }
    if (children) {
        if (Array.isArray(children)) {
            children.forEach(item => {
                item && e.appendChild(item);
            });
        } else {
            e.innerText = children;
        }
    }
    return e;
}

function createElement(type) {
    switch (type) {
        case 'svg':
        case 'path':
            return document.createElementNS("http://www.w3.org/2000/svg", type);
        default:
            return document.createElement(type);
    }
}


