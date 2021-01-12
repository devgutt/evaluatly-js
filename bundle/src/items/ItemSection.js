import { RenderList } from '../Render';
import { section } from '../Html';
import { runProgramObject } from '../Program';

export default function ItemSection(parent, item, control, rootSubmit) {

    if (!item.items) {
        return null;
    }

    const style = runProgramObject(item.style, control);

    const s = parent.appendChild(section({ class: "_at _aj", style: style }));
    
    RenderList(s, item.items, control, rootSubmit);

}
