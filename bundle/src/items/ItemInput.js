import { data } from '../Data';
import Icon from '../Icons';
import { labl, div, button, input, textarea } from '../Html';
import { runProgramObject } from '../Program';

export default function ItemInput(parent, item, rootSubmit, control) {

    const isForm = rootSubmit && rootSubmit.inputSubmit;

    let elements;

    if (isForm) {
        const btnSubmit = button({ class: "button_ic icon theme_button", title: rootSubmit && rootSubmit.label, tabIndex: "-1" }, [Icon("arrowRight")]);
        elements = div({ class: "field" });
        parent.appendChild(
            div({ class: "_ii_form col theme_form_submit inputs" }, [
                elements,
                btnSubmit
            ])
        )
        rootSubmit.addListener(state => {
            btnSubmit.disabled = state == 'PROCESSING'
        })
    } else {
        elements = div({ class: "_ii_div theme_form inputs" });
        parent.appendChild(elements);
    }

    Input(elements, item, control);
}

function Input(parent, item, control) {

    if (item.label) {
        const styleLabel = runProgramObject(item.style_label, control);
        parent.appendChild(labl({ for: item.save_key, class: "label", style: styleLabel }, item.label));
    }

    const style = runProgramObject(item.style_input, control);

    const props = {
        id: item.save_key,
        required: item.required == true ? true : null,
        onChange: e => {
            data.save(item.save_key, 'value', e.target.value);
        },
        placeholder: item.placeholder,
        autofocus: item.autofocus === true ? true : null,
        style: style
    }
    const value = data.get(item.save_key, 'value');

    let el = null;

    switch (item.type) {
        case 'text':
            el = input({
                type: "text",
                class: "input",
                value: value,
                minlength: item.min,
                maxlength: item.max,
                pattern: item.pattern,
                autocomplete: "off",
                ...props
            });
            break;
        case 'name':
            el = input({
                type: "text",
                class: "input",
                value: value,
                minlength: item.min,
                maxlength: item.max,
                pattern: item.pattern,
                autocomplete: "name",
                ...props
            });
            break;
        case 'email':
            el = input({
                type: "email",
                class: "input",
                value: value,
                minlength: item.min,
                maxlength: item.max,
                pattern: item.pattern,
                multiple: item.multiple,
                autocomplete: "email",
                ...props
            });
            break;
        case 'phone':
            el = input({
                type: "tel",
                class: "input",
                value: value,
                minlength: item.min,
                maxlength: item.max,
                pattern: item.pattern,
                autocomplete: "tel",
                ...props
            });
            break;
        case 'url':
            el = input({
                type: "url",
                class: "input",
                value: value,
                minlength: item.min,
                maxlength: item.max,
                pattern: item.pattern,
                autocomplete: "url",
                ...props
            });
            break;
        case 'number':
            el = input({
                type: "number",
                class: "input",
                value: value,
                min: item.min,
                max: item.max,
                step: item.step,
                pattern: item.pattern,
                autocomplete: "off",
                ...props
            });
            break;
        case 'password':
            el = input({
                type: "password",
                class: "input",
                value: value,
                minlength: item.min,
                maxlength: item.max,
                pattern: item.pattern,
                autocomplete: item.auto,
                ...props
            });
            break;
        case 'textlong': {
            const t = textarea({
                class: "textarea",
                minlength: item.min,
                maxlength: item.max,
                cols: "40",
                rows: "5",
                autocomplete: "off",
                ...props
            });
            t.value = value;
            el = t;
            break;
        }
    }
    
    if (el) {
        parent.appendChild(el);

        if (props.autofocus) {
            el.focus();
        }
    }
}


