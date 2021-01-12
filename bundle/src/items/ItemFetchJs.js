import { RenderList } from '../Render';
import { section } from '../Html';

export default function ItemFetchJs(parent, item, control, rootSubmit) {

    const root = parent.appendChild(section({ class: "_at _aj" }));

    const items = control.fetchJs(item.fn);
    if (items) {
        RenderList(root, items, control, rootSubmit);
    }

}


