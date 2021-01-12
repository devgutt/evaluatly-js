import { runBatch, runProgramObject } from '../Program';
import { button } from '../Html';

export default function ItemButton(parent, item, control) {

    function run() {
        runBatch(item.program, control, false)
            .catch(error => {
                control.showAlertBox('error', error);
            });
    }

    const style = runProgramObject(item.style, control);

    parent.appendChild(button(
        { 
            type: 'button', 
            class: 'button_ic theme_button', 
            onClick: (() => run()),
            style: style
        }, item.label));

}
