import { runBatch, runProgramObject } from '../Program';
import { a } from '../Html';

export default function ItemLink(parent, item, control) {

    function run() {
        runBatch(item.program, control, false)
            .catch(error => {
                control.showAlertBox('error', error);
            });
    }

    let click, href, target;
    if (!item.url) {
        href = "#";
        click = e => {
            e.preventDefault();
            run();
        }
    } else {
        href = item.url;
        target = "_blank"
    }

    const style = runProgramObject(item.style, control);

    parent.appendChild(a(
        { 
            class: 'a_ic _at theme_link', 
            href: href, 
            target: target, 
            onClick: click, 
            rel: 'noreferrer noopener',
            style: style
         }, item.label));
    
}
