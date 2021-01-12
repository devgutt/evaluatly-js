import { getParamsData } from '../Program';
import {RenderList} from '../Render';
import { api } from '../Api';
import { data } from "../Data";
import Icon from '../Icons';
import { div, span, button, p, section } from '../Html';

export default function ItemFetch(parent, item, control, rootSubmit) {

    const root =  parent.appendChild(section({ class: "_at _aj" }));

    function showError(msg, showBtn) {
        cleanRoot();
        root.appendChild(
            div({ class: "div_rt" }, [
                span({}, msg),
                showBtn && button({ onClick: run, class: "button_ic icon theme_button" }, [Icon("refresh")])
            ])
        )
    }

    function showProg() {
        cleanRoot();
        root.appendChild(p({class: "p_it _at"}, "..."))
    }

    function showItems(items) {
        cleanRoot();
        RenderList(root, items, control, rootSubmit);
    }

    function cleanRoot() {
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
    }

    function run() {
        showProg();

        const hash = data.getHash();
        const params = item.data;

        if (data !== undefined) {

            const p = new URLSearchParams();
            const d = getParamsData(params, control);
            p.append('hash', hash);
            p.append('origin', window.location.origin);
            p.append('data', JSON.stringify(d));

            const url = item.endpoint;

            api('POST', url, p)
                .then(res => {
                    if (res) {
                        if (res.ok == true) {
                            showItems(Array.isArray(res.res) ? res.res : [res.res]);
                        } else {
                            res.error_code && console.error(res.error_code);
                            showError(res.error_msg || "Error");
                        }
                    } else {
                        showError("Error", true);
                    }
                })
                .catch(error => {
                    console.error('error', error);
                    showError("Error", true);
                });

        }

    }

    run();

}


