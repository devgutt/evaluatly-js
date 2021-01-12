import { img } from '../Html';
import { runProgramItem, runProgramObject } from '../Program';

export default function ItemImage(parent, item, control) {

    const style = runProgramObject(item.style, control);

    parent.appendChild(
        img({
            class: "img_it theme_image",
            src: runProgramItem(item.src, control),
            width: item.width,
            height: item.height,
            alt: item.alt,
            title: item.title,
            style: style
        })
    );
}
