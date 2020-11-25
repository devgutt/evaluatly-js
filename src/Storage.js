const STORAGE_PROGRAM = 'E_STORAGE_PROGRAM';
const STORAGE_DATA = 'E_STORAGE_DATA';
const STORAGE_STORE = 'E_STORAGE_STORE';

export function storeProgram(value) {
    const data = JSON.stringify(value);
    sessionStorage.setItem(STORAGE_PROGRAM, data);
}

export function retrieveProgram() {
    const data = sessionStorage.getItem(STORAGE_PROGRAM);
    return data ? JSON.parse(data) : null;
}

export function removeProgram() {
    sessionStorage.removeItem(STORAGE_PROGRAM);
}

export function storeData(value) {
    const data = JSON.stringify(value);
    sessionStorage.setItem(STORAGE_DATA, data);
}

export function retrieveData() {
    const data = sessionStorage.getItem(STORAGE_DATA);
    return data ? JSON.parse(data) : {};
}

export function removeData() {
    sessionStorage.removeItem(STORAGE_DATA);
}

export function storeLocal(key, value) {
    const data = JSON.stringify(value);
    localStorage.setItem(getLocalKey(key), data);
}

export function retrieveLocal(key) {
    const data = localStorage.getItem(getLocalKey(key));
    return data ? JSON.parse(data) : {};
}

export function removeLocal(key) {
    const data = localStorage.removeItem(getLocalKey(key));
    return data ? JSON.parse(data) : null;
}

function getLocalKey(key) {
    return STORAGE_STORE + "::" + (key || "main");
}

