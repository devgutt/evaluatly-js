import { storeData, retrieveData } from './Storage';

const DATA_INITIAL = {
    value: {}
};

const DATA = {
    hash: null,
    data: {}
};

export const data = {
    start: (hash, initialData) => {
        DATA.hash = hash;
        DATA.data = {};
        DATA_INITIAL.value = initialData || {};
        const stored = retrieveData();
        if (stored && (stored.hash == hash)) {
            DATA.data = stored.data;
            return true;
        } else {
            if (initialData) {
                data.load();
            }
            data.store();
        }
        return false;
    },
    load: () => {
        DATA.data = {};
        const initialData = DATA_INITIAL.value;
        for (const key in initialData) {
            if (initialData.hasOwnProperty(key) && initialData[key]) {
                const v = initialData[key];
                if (v) {
                    if (typeof v === 'object') {
                        for (const prop in v) {
                            if (v.hasOwnProperty(prop) && v[prop]) {
                                data.save(key, prop, v[prop]);
                            }
                        }
                    } else {
                        data.save(key, 'value', v);
                    }
                }
            }
        }
    },
    getHash: () => DATA.hash,
    get: (key, prop) => {
        const i = DATA.data[key];
        const v = (i && prop) ? i[prop] : i;
        return v != undefined ? v : '';
    }, 
    getAll: () => {
        return DATA.data;
    },
    save: (key, prop, value) => {
        if (key == undefined) return false;
        if (DATA.data[key] == undefined) DATA.data[key] = {};
        if (value !== undefined) {
            DATA.data[key][prop] = value
        } else {
            delete DATA.data[key][prop];
        }
        return true;
    },
    saveVar: (key, value) => {
        if (key == undefined) return false;
        if (value !== undefined) DATA.data[key] = value;
        return true;
    },
    delete: key => {
        delete DATA.data[key];
    },
    store: () => storeData(DATA),
    extract: keys => {
        const res = {};
        if (Array.isArray(keys)) {
            keys.forEach(key => {
                const o = DATA.data[key];
                if (o !== undefined) {
                    res[key] = o;
                }
            });
        }
        return res;
    },
    hasData: () => {
        for(var prop in DATA.data) {
            if(DATA.data.hasOwnProperty(prop)) {
                return true;
            }
        }
        return false;
    }
}

