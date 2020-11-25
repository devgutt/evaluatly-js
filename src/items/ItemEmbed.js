import { iframe } from '../Html';
import { runProgramObject } from '../Program';

export default function ItemEmbed(parent, item, control) {

    const style = runProgramObject(item.style, control);

    parent.appendChild(iframe({
        class: "iframe_it theme_embed", 
        allowFullScreen: true,
        src: item.src,
        width: item.width || "560",
        height: item.height || "315",
        title: item.title,
        allow: item.allow,
        style: style
    }))
}
