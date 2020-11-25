import { RenderList } from './Render';
import PageFormPayment from './PageFormPayment';
import PageForm from './PageForm';
import { div } from './Html';
import { runProgramObject } from './Program';

export default function Page(parent, page, control) {

    if (page.submit) {

        const rootSubmit = {
            label: page.submit.label,
            inputSubmit: page.submit.input_submit === true
        }

        if (page.submit.payment) {
            PageFormPayment(parent, page, control, rootSubmit)
        } else {
            PageForm(parent, page, control, null, rootSubmit);
        }

    } else {
        const style = runProgramObject(page.style_content, control);

        const root = parent.appendChild(div({ class: 'content-items theme_content', style: style}));

        RenderList(root, page.items, control, false);
    }

}

