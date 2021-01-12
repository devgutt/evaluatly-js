import Load from './Load';
import { api } from './Api';
import { div } from './Html';

export function loadVar(v, config) {
    show(v, config);
}

export function loadUrl(url, config) {
    api('GET', url)
        .then(res => {
            if (res) {
                show(res, config);
            }
        }).catch(e => {
            console.error('ERROR', e);
        });
}

function show(load, config) {

    const c = config || {};

    const containerId = c['containerId'];
    const restart = c['restart'] || false;
    const fetchJs = c['fetch'] || {};
    const callJs = c['call'] || {};

    const root = getRoot(containerId);

    if (!root) {
        console.error('Container not found');
        return;
    }

    Load(root, load.hash, load.story, load.theme, load.data, restart, fetchJs, callJs);
}

function getRoot(containerId) {

    // const root = getShadow(container || document.getElementById("container"));
    // stripe doesn't work with Shadow Doom

    if (!containerId) {
        return document.body.appendChild(div({
            style: {
                position: "fixed",
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                overflow: "scroll",
                zIndex: 1000
            }
        }));
    } else {
        return document.getElementById(containerId);
    }
}

function getShadow(container) {
    if (!container.shadowRoot) {
        container.attachShadow({ mode: "open" });
    }
    return container.shadowRoot;
}


