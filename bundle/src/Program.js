import { api } from "./Api";
import { data } from "./Data";
import { processText } from './Text';
import { retrieveLocal, storeLocal } from './Storage';

export async function runBatch(batch, control, stop) {

    if (batch === undefined || batch == '') return;
    const b = Array.isArray(batch) ? batch : [batch];
    for (let i = 0; i < b.length; i++) {
        if (stop && stop()) return;
        const p = b[i];
        if (p !== undefined) {
            await runProgramItem(p, control, stop);
        }
    }
}

export function runProgramItem(item, control, stop) {

    if (item === null || typeof item !== 'object') {
        return item;
    }

    const fn = Object.keys(item)[0];
    const par = item[fn];

    switch (fn) {
        case 'next_page':
            return control.next();
        case 'previous_page':
            return control.back();
        case 'reload_page':
            return control.reload();
        case 'jump_page':
            return jump(par, control);
        case 'restart':
            return control.restart();
        case 'v':
            return data.get(par, "value");
        case 'i':
            return data.get(par, "id");
        case 'l':
            return data.get(par, "label");
        case 'prop':
            return data.get(par[0], par[1]);
        case 'save':
            return save(par, control);
        case 'delete':
            return deleteData(par);
        case 'if':
            return iff(par, control, stop);
        case 'call':
            return call_program(par, control, stop);
        case 'call_js':
            return call_js(par, control, stop);
        case 'qs':
            return getQueryString(par);
        case 'redirect':
            return redirect(par, control);
        case 'parent':
            return parent(par, control);
        case 'has_parent':
            return isEmbed() === (par === true ? true : false);
        case '+':
        case '-':
        case '*':
        case '/':
        case 'and':
        case 'or':
            return reduce(par, control, fn);
        case '==':
        case '!=':
        case '>':
        case '>=':
        case '<':
        case '<=':
            return binary(par, control, fn);
        case 'not':
            return unary(par, control, fn);
        case 'sub':
            return processText(par);
        case 'console':
            return print(par, control);
        case 'throw':
            throwError(par);
            break;
        case 'store':
            return store(par);
        case 'restore':
            return restore(par);
        case 'remove':
            return remove(par);
        case 'alert':
            return control.showAlertBox(par.is, par.msg, par.interval, par.style);
        default:
            console.error("Function not found: ", fn);
    }
}

function save(par, control) {
    const key = par[0];
    const prop = par[2] != undefined ? par[1] : 'value';
    const value = par[2] != undefined ? par[2] : par[1];
    if (key) {
        const v = value != undefined ? runProgramItem(value, control) : undefined;
        data.save(key, prop, v);
        data.store();
    }
}

function deleteData(par) {
    data.delete(par);
    data.store();
}

const fc = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "and": (a, b) => a && b,
    "or": (a, b) => a || b,
    "==": (a, b) => a == b,
    "!=": (a, b) => a != b,
    ">": (a, b) => a > b,
    ">=": (a, b) => a >= b,
    "<": (a, b) => a < b,
    "<=": (a, b) => a <= b,
    "not": a => !a
}

function reduce(par, control, oper) {
    return Array.isArray(par) && par.slice(1).reduce((acc, v) =>
        fc[oper](acc, runProgramItem(v, control)), runProgramItem(par[0]));
}

function binary(par, control, oper) {
    const a = runProgramItem(par[0], control);
    const b = runProgramItem(par[1], control);
    return fc[oper](a, b);
}

function unary(par, control, oper) {
    const a = runProgramItem(par, control);
    return fc[oper](a);
}

async function iff(par, control, stop) {
    for (let i = 0; i < par.length; i++) {
        const item = par[i];
        if (item.cond === undefined || runProgramItem(item.cond, control) === true) {
            await runBatch(item.program, control, stop);
            break;
        }
    }
}

function jump(par, control) {
    const r = runProgramItem(par, control);
    return control.jump(r);
}

function print(par, control) {
    if (Array.isArray(par)) {
        console.info(reduce(par, control, "+"));
    } else {
        console.info(runProgramItem(par, control));
    }
}

function throwError(msg) {
    throw msg;
}

function buildParams(pars, control) {
    const d = {};
    if (pars && Array.isArray(pars)) {
        pars.forEach(item => {
            if (typeof item === "object") {
                for (let key in item) {
                    const v = runProgramItem(item[key], control);
                    if (v !== undefined) {
                        d[key] = v;
                    }
                }
            } else {
                const v = data.get(item);
                if (v !== undefined) {
                    d[item] = v.value || v.id;
                }
            }
        });
    }
    return d;
}

export function getParamsData(pars, control) {
    const d = {};
    if (pars && Array.isArray(pars)) {
        return buildParams(pars, control);
    } else {
        const da = data.getAll();
        for (const key in da) {
            if (da.hasOwnProperty(key) && (!key.startsWith('_')) && da[key] && (typeof da[key] === "object")) {
                d[key] = da[key].value || da[key].id || da[key].label
            }
        }
    }
    return d;
}

async function call_program(par, control, stop) {

    if (par !== undefined) {
        const hash = data.getHash();
        const d = getParamsData(par.data, control);

        const p = new URLSearchParams();
        p.append('hash', hash);
        p.append('origin', window.location.origin);
        p.append('data', JSON.stringify(d));

        const url = par.endpoint;

        const res = await api('POST', url, p);

        if (par.ignore_response == true) return;

        if (res && res.ok == true) {
            if (res.res) {
                await runBatch(res.res, control, stop);
            }
        } else {
            res.error_code && console.error(res.error_code);
            throwError(res.error_msg || "Error");
        }

    }
}

async function call_js(par, control, stop) {
    if (par !== undefined) {
        let items;
        try {
            items = control.callJs(par);
        } catch (error) {
            console.error('ERROR', error);
            throwError('Error');
        }

        if (items) {
            await runBatch(items, control, stop);
        }
    }
}

function getQueryString(key) {
    const q = new URLSearchParams(window.location.search);
    return q.get(key) || "";
}

function redirect(par, control) {

    const data = buildParams(par.data, control);
    const url = runProgramItem(par.url, control);

    redirectSubmit(url, data, par.method);
}

function redirectSubmit(path, params, method) {

    if (!path) return;

    const f = document.createElement('form');
    f.method = method === 'post' ? method : 'get';
    f.action = path;
    f.className = '_hd';
    f.target = '_parent';

    for (const key in params) {
        if (params.hasOwnProperty(key) && params[key]) {
            const h = document.createElement('input');
            h.type = 'hidden';
            h.name = key;
            h.value = params[key];
            f.appendChild(h);
        }
    }

    document.body.appendChild(f);
    f.submit();
}

function parent(par, control) {
    if (!isEmbed()) return;
    if (!par || !par.action) return;

    switch (par.action) {
        case 'close':
            sendMessageParent('close', "");
            break;
        case 'message': {
            const data = buildParams(par.data, control);
            sendMessageParent('message', data);
            break;
        }
    }
}

function sendMessageParent(action, par) {
    if (!isEmbed()) return;
    window.parent.postMessage({ action: action, par: par }, '*');
}

export function isEmbed() {
    return window.self !== window.parent;
}

function store(par) {
    if (!Array.isArray(par)) return;
    const key = data.getHash();
    const d = retrieveLocal(key);

    par.forEach(variable => {
        d[variable] = data.get(variable);
    });

    storeLocal(key, d);
}

function restore(par) {
    if (!Array.isArray(par)) return;
    const key = data.getHash();
    const d = retrieveLocal(key);

    par.forEach(variable => {
        data.saveVar(variable, d[variable]);
    });
    data.store();
}

function remove(par) {

    const key = data.getHash();

    if (par === "all") {
        storeLocal(key, {});
    } else {
        if (!Array.isArray(par)) return;
        const d = retrieveLocal(key);
    
        par.forEach(variable => {
            delete d[variable];
        });

        storeLocal(key, d);
    }

}

export function runProgramObject(obj, control) {

    if (!obj) return null;

    const res = {};
    for (let key in obj) {
        const v = runProgramItem(obj[key], control);
        if (v !== undefined) {
            res[key] = v;
        }
    }
    return res;
}