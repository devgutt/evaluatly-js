import Root from './Root';
import { data } from './Data';
import { retrieveProgram, removeProgram, removeData } from './Storage';
import { _ } from './Strings';
import { div } from './Html';
import { processTheme } from './Theme';

export default function Load(root, hash, story, theme, initialData, restart, fetchJs, callJs) {

    if (!root) {
        return;
    }

    async function init(hash, theme) {

        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }

        processTheme(root, theme);

        if (restart) {
            removeProgram();
            removeData();
        }

        let initialState = null;
        if (data.start(hash, initialData)) {
            initialState = retrieveProgram();
        } else {
            removeProgram()
        }

        return initialState;
    }

    init(hash, theme)
        .then(initialState => {
            const p = root.appendChild(div({ class: "evaluatly" }));
            Root(root, p, story, initialState, fetchJs, callJs);
        });

}