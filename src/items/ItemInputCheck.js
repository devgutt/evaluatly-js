import { data } from '../Data';
import { processText } from '../Text';
import Icon from '../Icons';
import { input, labl, div, p, button, span } from '../Html';
import { runProgramObject } from '../Program';

const checkMinimum = (item, refCheck) => {

    if (refCheck && refCheck && (item.min !== undefined || item.max !== undefined)) {
        const counter = item.options.reduce((c, i) => data.get(i.save_key) !== '' ? ++c : c, 0);
        if ((counter >= (item.min || 0)) && (counter <= (item.max || 100000))) {
            refCheck.setCustomValidity("");
        } else {
            refCheck.setCustomValidity(item.error_range_msg || "Out of range");
        }
    }
}

export default function ItemInputCheck(parent, item, rootSubmit, control) {

    let refCheck;

    const isForm = rootSubmit && rootSubmit.inputSubmit;

    const update = (opt, checked) => {

        if (checked) {
            data.save(opt.save_key, 'value', opt.value);
            data.save(opt.save_key, 'id', opt.id);
            data.save(opt.save_key, 'label', opt.label);
        } else {
            data.delete(opt.save_key);
        }
        checkMinimum(item, refCheck);
    };

    const numChecks = item.options.length;
    const showMarker = !isForm || (item.show_marker === false ? false : true);
    const showRipple = item.show_ripple === true ? true : false;

    const checks = [];
    for (let index = 0; index < numChecks; index++) {
        const opt = item.options[index];
        const id = `${opt.save_key}-${index}`;
        const ck = input({
            type: "checkbox",
            id: id,
            required: opt.required == true ? true : null,
            onChange: e => update(opt, e.target.checked),
            checked: data.get(opt.save_key) !== '' ? true : null
        });
      
        const styleContainer = runProgramObject(opt.style_container, control);
        const style = runProgramObject(opt.style, control);

        if (index == 0) {
            refCheck = ck;
        }
        checks.push(
            labl({ for: id, class: "option_container", style: styleContainer }, [
                ck,
                div({ class: "option" + (!showMarker ? " nomarker" : ""), style: style }, [
                    showMarker && div({ class: "marker checkbox" + (showRipple ? " ripple" : "") }),
                    div({ class: "txt _us" }, [
                        p({ class: "title", innerHTML: processText(opt.label) }),
                        opt.description && p({ class: "desc" }, opt.description)
                    ])
                ])
            ])
        );
    }

    const styleLabel = runProgramObject(item.style_label, control);

    const elements = [
        item.label && p({ class: "label _at", style: styleLabel }, item.label),
        div({ class: "options _aj" }, checks)
    ]

    checkMinimum(item, refCheck);

    if (isForm) {
        ItemInputCheckForm(parent, rootSubmit, elements)
    } else {
        parent.appendChild(div({class: "_io_field theme_form checks"}, elements));
    }

}

function ItemInputCheckForm(parent, rootSubmit, elements) {

    const btnSubmit = button({class: "button_ic theme_button checks"}, [
        rootSubmit.label && span({}, rootSubmit.label) || div({class: "icon"}, [ Icon("arrowRight") ])
    ]);

    parent.appendChild(
        div({class: "_io_form theme_form_submit"}, [
            ...elements,
            div({class: "_at"}, [ btnSubmit ])
        ])
    )

    rootSubmit.addListener(state => {
        btnSubmit.disabled = state == 'PROCESSING'
    })
}
