import { RenderList } from './Render';
import { runBatch, runProgramObject } from './Program';
import Icon from './Icons';
import { data } from './Data';
import { form, button, div, span } from './Html';

export default function PageForm(parent, page, control, parentSubmit, rootSubmit) {

    let state = 'START', btnSubmit;

    const listeners = [];

    function setState(newState) {
        if (state != newState) {
            state = newState;
            if (btnSubmit) {
                btnSubmit.disabled = state == 'PROCESSING';
            }

            listeners.forEach(f => {
                f(newState);        
            });
        }
    }

    rootSubmit.addListener = f => {
        listeners.push(f);
    }

    function run() {
        runBatch(page.submit.program, control, false)
            .catch(error => {
                control.showAlertBox('error', error);
            });
    }
   
    const _next = () => {
        data.store();
        run();
    }

    const _submit = async e => {
        e.preventDefault();

        if (state == 'PROCESSING') {
            return;
        }
        setState('PROCESSING');

        if (parentSubmit) {
            parentSubmit()
                .then(() => {
                    _next();
                    setState('DONE');
                })
                .catch(error => {
                    if (error) {
                        if (error.error) {
                            control.showAlertBox('error', error.error);
                        } else if (error.warning) {
                            control.showAlertBox('warning', error.warning);
                        } else {
                            console.error(error);
                            control.showAlertBox('error', 'Error processing payment');
                        }
                    }
                    setState('ERROR');
                });

        } else {
            _next();
            setState('DONE');
        }
    };

    const style = runProgramObject(page.style_content, control);

    const root = parent.appendChild(form({ class: "content-items theme_content", onSubmit: _submit, style: style }));

    RenderList(root, page.items, control, rootSubmit);

    if (!rootSubmit.inputSubmit) {
        btnSubmit = root.appendChild(button({ class: "button_ic theme_button" }, [
            rootSubmit.label && span({}, rootSubmit.label) || div({ class: 'icon' }, [Icon("arrowRight")])
        ]))
    }

}
