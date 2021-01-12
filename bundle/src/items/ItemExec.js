import { runBatch } from '../Program';
import Icon from '../Icons';
import { div, span, button } from '../Html';

export default function ItemExec(parent, item, control) {

    const root = parent.appendChild(div({}));

    function run() {
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
        runBatch(item.program, control, false)
            .catch(error => {
                root.appendChild(div({ class: "div_rt" }, [
                    span({}, error),
                    button({ class: "button_ic icon theme_button", onClick: run }, [Icon("refresh")])
                ]))
            });
    }

    setTimeout(() => run(), item.delay !== undefined ? item.delay : 0);

}
