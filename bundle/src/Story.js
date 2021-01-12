import Page from './Page';
import { data } from './Data';
import { storeProgram } from './Storage';
import { runBatch, runProgramObject } from './Program';
import Icon from './Icons';
import { div, a, span, img } from './Html';
import { processText } from './Text';

const defaultState = {
    page: 0,
    page_back: []
};

function reducerState(state, par) {
    switch (par.action) {
        case 'next':
            par.history && state.page_back.push(state.page);
            return { ...state, page: state.page + 1 };
        case 'jump':
            par.history && state.page_back.push(state.page);
            return { ...state, page: par.page }
        case 'back': {
            const pagePop = state.page_back.pop();
            if (pagePop !== undefined) {
                return { ...state, page: pagePop };
            }
            return state;
        }
        case 'reload':
            return { ...state };
        case 'restart':
            return { ...defaultState }
    }
}

function reducer(state, par) {
    const newState = reducerState(state, par);
    storeProgram(newState);
    return newState;
}

export default function Story(root, rootAlert, load, initialState, controlRoot) {

    let state = initialState || defaultState;

    const alertBox = getAlertBox(rootAlert);

    function dispatch(action) {
        state = reducer(state, action);
        renderPage();
    }

    const control = {
        ...controlRoot,
        pageIndex: state.page,
        showAlertBox: (is, msg, interval, style) => {
            alertBox.show(is, msg, interval, style, control);
        },
        next: () => {
            if (state.page < load.pages.length - 1) {
                dispatch({ action: 'next', history: load.pages[state.page].history != false });
            }
        },
        jump: pageId => {
            const pageIndex = load.pages.findIndex(e => e.page_id == pageId);
            if (pageIndex !== -1 && pageIndex !== state.page) {
                dispatch({ action: 'jump', page: pageIndex, history: load.pages[state.page].history != false })
            }
        },
        restart: () => {
            dispatch({ action: 'restart' });
            data.load();
            data.store();
        },
        back: () => {
            dispatch({ action: 'back' })
        },
        reload: () => {
            dispatch({ action: 'reload' })
        }
    };

    const el = {
        logo: Logo(load.logo, control),
        back: Back(load.env && load.env.back_label, control),
        brand: Brand(load.brand),
        progress: Progress(load.progress, load.pages.length - 1, control),
        page: div({ class: 'page' })
    }

    const content = div({ class: 'content theme_page' }, [
        div({ class: 'header' }, [
            div({}, [
                el.progress.e,
            ]),
            div({ class: 'main' }, [
                el.logo.e
            ]),
        ]),
        el.page,
        div({ class: 'footer' }, [
            div({}, [el.back.e]),
            div({}, [el.brand.e])
        ])
    ]);

    function renderPage() {

        const page = load.pages[state.page];

        processPageStyle(content, page.style);

        const showLogo = page && (page.env == undefined || page.env.show_logo == undefined || page.env.show_logo == true);
        const showBack = state.page_back.length > 0 && page && (page.env === undefined || page.env.show_back !== false);
        const progress = page && page.progress;

        el.logo.show(showLogo);
        el.back.show(showBack);

        el.progress.update(state.page, progress);

        while (el.page.firstChild) {
            el.page.removeChild(el.page.firstChild);
        }
        Page(el.page, page, control);

        control.scrollTop();
    }

    renderPage();

    root.appendChild(content);
}

function Progress(item, qtdPages, control) {

    const showStory = item && item.show;
    const el = div({ class: "progress_bar theme_progress" });
    const qtd = (item && item.qtd) || qtdPages;
    let style = [];

    return {
        e: el,
        update: (n, p) => {
            if ((p && p.show) || (showStory && (p == undefined || p.show == undefined))) {

                let v = 0;
                if (p && !isNaN(p.value)) {
                    v = p.value;
                } else {
                    v = 100 * (n / qtd);
                }
                v = Math.round(v);
                if (v > 100) { v = 100 }
                if (v < 0) { v = 0 }

                el.style.width = v + "%";
                el.style.display = 'block';

                if (style.length > 0) {
                    style.forEach(key => el.style.removeProperty(key));
                    style = [];
                }

                if (p && p.style) {
                    const s = runProgramObject(p.style, control);
                    for (let key in s) {
                        style.push(key);
                        el.style[key] = s[key];
                    }
                }

            } else {
                el.style.display = 'none';
            }
        }
    }

}

function Back(label, control) {

    const back = e => {
        e.preventDefault();
        control.back();
    }

    const el = div({}, [
        a({ class: 'back _us', href: '#', onClick: back }, [
            Icon("arrowNarrowLeft"),
            span({}, label)
        ])
    ]);

    return {
        e: el,
        show: b => {
            el.style.display = (b ? 'block' : 'none')
        }
    };
}

function Logo(item, control) {

    let el;
    if (item) {

        const click = e => {
            e.preventDefault();
            if (item.program) {
                runBatch(item.program, control, false)
                    .catch(error => {
                        control.showAlertBox('error', error);
                    });
            }
        }

        const style = runProgramObject(item.style, control);

        el = div({}, [
            img({
                class: "logo" + (item.program ? " pt" : ""),
                src: item.img,
                width: item.width,
                height: item.height,
                alt: item.alt,
                style: style,
                onClick: click
            })
        ]);
    }

    return {
        e: el,
        show: b => {
            if (el) {
                el.style.display = (b ? 'block' : 'none')
            }
        }
    };
}

function Brand(brand) {

    const show = !brand || brand.show !== false;

    let el;
    if (show) {

        if (brand && brand.txt) {
            el = [ span({ innerHTML: processText(brand.txt) }) ];
        } else {
            el = [
                span({}, "Powered by "),
                a({ class: "eval", href: "https://evaluatly.com", target: "_blank", rel: "noopener noreferrer" }, "evaluatly")
            ];
        }

        el = div({}, [ div({ class: 'brand' }, el) ]);
    }

    return {
        e: el
    };
}

function getAlertBox(parent) {

    const getStyle = s => (['warning', 'info', 'success', 'error'].indexOf(s) != -1) ? s : "error";
    let timer;

    function clean() {
        parent.style.display = 'none';
        if (timer) {
            clearTimeout(timer);
        }
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    return {
        e: parent,
        show: (is, msg, interval, style, control) => {
            clean();
            const s = runProgramObject(style, control);
            parent.appendChild(div({ class: getStyle(is) + " theme_alert", 'innerHTML': processText(msg), style: s }));
            if (interval !== -1) {
                timer = setTimeout(() => parent.style.display = 'none', interval || 3000);
            }
            parent.style.display = 'block';
        }
    }
}

function processPageStyle(el, style, control) {

    el.removeAttribute('style');

    if (style) {
        const s = runProgramObject(style, control);
        for (let key in s) {
            el.style[key] = s[key];
        }
    }

}


