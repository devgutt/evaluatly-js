import { runProgramItem } from '../Program';
import { RenderList } from '../Render';

export default function ItemRenderIf(parent, item, control, rootSubmit) {

    for (let i = 0; i < item.value.length; i++) {
        const c = item.value[i];
        if (c.cond === undefined || runProgramItem(c.cond, control) === true) {
            (Array.isArray(c.render)) &&
                RenderList(parent, c.render, control, rootSubmit);
            break;
        }
    }

}


