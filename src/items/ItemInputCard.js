import Icon from '../Icons';
import { div, labl, button, span } from '../Html';

export default function ItemInputCard(parent, item, rootSubmit) {

    if (!rootSubmit.payment) {
        return null;
    }

    const isPaid = rootSubmit.payment.isPaid();

    // const fc = style.get('input_font_color');
    // const fe = style.get('input_error_color');
    // const fs = style.get('font_size');

    const fc = "#000000";
    const fe = "#ff0000";
    const fs = "20px";

    const options = {
        style: {
            base: {
                iconColor: fc,
                color: fc,
                fontSize: fs,
                fontSmoothing: "antialiased",
                fontFamily: 'Roboto, sans-serif'
            },
            invalid: {
                iconColor: fe,
                color: fe,
            }
        },
        disabled: isPaid || item.disabled
    };

    let complete = false, empty = true, error = "";
    
    const card = rootSubmit.payment.registerCard({
        options: options,
        getError: () => error,
        getComplete: () => complete,
        getEmpty: () => empty
    });

    if (card) {

        const el = render(parent, item, rootSubmit);
    
        card.mount(el.cardElement);
    
        card.on('change', function (e) {
            error = e.error ? e.error.message : "";
            complete = e.complete;
            empty = e.empty;
            el.showError(error);
        });

        rootSubmit.addListener(state => {
            card.update({ disabled: (state == 'PROCESSING' || state == 'DONE') });
        })

    }
}

function render(parent, item, rootSubmit) {

    const isForm = rootSubmit && rootSubmit.inputSubmit;

    const cardElement = div({ id: "card-element" });
    const errorElement = div({ class: "error", style: {display: "none"}});

    function showError(error) {
        if (error) {
            errorElement.textContent = error;
            errorElement.style.display = 'block'
        } else {
            errorElement.textContent = "";
            errorElement.style.display = 'none'
        }
    }

    const element = [
        div({ class: "field" }, [
            item.label && labl({ for: "card-element" }, item.label),
            div({ class: "txt" }, [
                cardElement,
                errorElement
            ])
        ])
    ]

    if (isForm) {
       
        const btnSubmit = button({ class: "button_ic theme_button" }, [
            rootSubmit.label && span({}, rootSubmit.label) || div({ class: "icon" }, [Icon("arrowRight")])
        ]);

        parent.appendChild(div({ class: "_ii_form card" }, element));
        parent.appendChild(div({ class: "_at" }, [ btnSubmit ]));

        rootSubmit.addListener(state => {
            btnSubmit.disabled = state == 'PROCESSING'
        })

    } else {
        
        parent.appendChild(div({ class: "_ii_div card" }, element));
    
    }

    return {
        cardElement: cardElement,
        showError: showError
    }
}


