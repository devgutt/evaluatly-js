import { data } from '../Data';
import { processText } from '../Text';
import { div, button, p, labl, input } from '../Html';
import { runProgramObject } from '../Program';

export default function ItemInputRadio(parent, item, rootSubmit, control) {

    const isForm = rootSubmit && rootSubmit.inputSubmit;

    if (isForm) {
        ItemInputRadioForm(parent, item, control);
    } else {
        ItemInputRadioField(parent, item, control)
    }

}

function ItemInputRadioForm(parent, item, control) {

    const btnRef = button({ style: { display: "none" } });

    let timer = null;
    const save = (value, id, label) => {
        if (timer !== null) return;
        data.save(item.save_key, 'value', value);
        data.save(item.save_key, 'id', id);
        data.save(item.save_key, 'label', label);
        timer = setTimeout(() => {
            btnRef.click();
            timer = null;
        }, 400);
    };

    parent.appendChild(
        div({ class: "_io_form theme_form_submit radios" }, [
            ...ItemInputRadioCommon(item, save, control, true),
            btnRef
        ])
    )
}

function ItemInputRadioField(parent, item, control) {

    const save = (value, id, label) => {
        data.save(item.save_key, 'value', value);
        data.save(item.save_key, 'id', id);
        data.save(item.save_key, 'label', label);
    };

    parent.appendChild(
        div({ class: "_io_field theme_form radios" }, ItemInputRadioCommon(item, save, control, false))
    )
}

function ItemInputRadioCommon(item, save, control, isForm) {

    const showMarker = !isForm || (item.show_marker === false ? false : true);
    const showRipple = item.show_ripple === true ? true : false;

    const elOptions = item.options.map((opt, i) => {
        const props = {
            type: "radio",
            id: `${item.save_key}-${i}`,
            name: item.save_key,
            required: item.required == true ? true : null,
            onClick: () => save(opt.value, (opt.id || i), opt.label),
            checked: data.get(item.save_key, "id") === (opt.id || i) ? true : null
        }
        const styleContainer = runProgramObject(opt.style_container, control);
        const style = runProgramObject(opt.style, control);

        return (
            labl({ for: props.id, class: "option_container", style: styleContainer }, [
                input(props),
                div({ class: "option" + (!showMarker ? " nomarker" : ""), style: style }, [
                    showMarker && div({ class: "marker radio" + (showRipple ? " ripple" : "") }),
                    div({ class: "txt _us" }, [
                        p({ class: "title", innerHTML: processText(opt.label) }),
                        opt.description && p({ class: "desc" }, opt.description)
                    ])
                ])
            ])
        )
    })

    const styleLabel = runProgramObject(item.style_label, control);

    return [
        item.label && p({ class: "label _at", style: styleLabel }, item.label),
        div({ class: "options _aj" }, elOptions)
    ]
}
