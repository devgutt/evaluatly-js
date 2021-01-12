import { data } from './Data';
import Story from './Story';
import { div } from './Html';

export default function Root(root, parent, load, initialState, fetchJs, callJs) {

    const dataJs = {
        get: (key, prop) => data.get(key, prop || "value"),
        set: (key, prop, value) => {
            data.save(key, prop, value);
            data.store();
        },
        del: key => data.delete(key)
    };

    const control = {
        fetchJs: (fn) => {
            if (fetchJs && fetchJs[fn] && typeof fetchJs[fn] === 'function') {
                return fetchJs[fn](dataJs);
            }
        },
        callJs: (fn) => {
            if (callJs && callJs[fn] && typeof callJs[fn] === 'function') {
                return callJs[fn](dataJs);
            }
        },
        scrollTop: () => {
            root.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const rootAlert = parent.appendChild(div({ class: 'alert' }));
    const r = parent.appendChild(div({ class: 'root' }));

    Story(r, rootAlert, load, initialState, control);
}

