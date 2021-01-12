import { loadStripe } from '@stripe/stripe-js/pure';
import { api } from './Api';
import { data } from './Data';
import PageForm from './PageForm';
import { div } from './Html';

async function getEndpoint(item) {

    const url = item.endpoint;

    const par = new URLSearchParams();
    par.append('origin', window.location.origin);

    const res = await api('POST', url, par);

    if (res && res.ok == true && res.res != undefined) {
        return res.res;
    } else {
        res.error_code && console.error(res.error_code);
        throw { error: res.error_msg };
    }
}

export default function PageFormPayment(parent, page, control, rootSubmit) {

    const root = parent.appendChild(div({}));
    const item = page.submit.payment;

    loadStripe(item.pk)
        .then(stripe => process(stripe, root, item, page, control, rootSubmit))
        .catch(error => {
            console.error('loadStripe', error);
        })

    return root;
}

function process(stripe, root, item, page, control, rootSubmit) {

    const saveKey = item.save_key || "payment_ok";

    let card, itemCard;

    rootSubmit.payment = {

        registerCard: data => {
            if (!card) {
                const elements = stripe.elements();
                card = elements.create("card", data.options);
                itemCard = data;
                return card;
            } else {
                console.error('Only one card per form');
            }

        },
        isPaid: () => (data.get(saveKey) != '')
    }

    const submit = async () => {

        if (rootSubmit.payment.isPaid()) {
            return;
        }

        if (itemCard.getError()) {
            throw null;
        }

        if (itemCard.getEmpty()) {
            if (item.required != false) {
                throw {'warning': 'Payment required'};
            } else {
                return;
            }
        }

        if (!itemCard.getComplete()) {
            throw {'warning': 'Complete the payment information.'};
        }

        const paymentData = {
            payment_method: {
                card: card,
                billing_details: {}
            }
        }

        if (item.data) {

            if (item.data.receipt_email && data.get(item.data.receipt_email, 'value') != '') {
                paymentData.receipt_email = data.get(item.data.receipt_email, 'value')
            }

            if (item.data.name && data.get(item.data.name, 'value') != '') {
                paymentData.payment_method.billing_details.name = data.get(item.data.name, 'value')
            }

            if (item.data.email && data.get(item.data.email, 'value') != '') {
                paymentData.payment_method.billing_details.email = data.get(item.data.email, 'value')
            }
        }

        const res = await getEndpoint(item);

        const secret = res.secret;
        const title = res.title;

        const payload = await stripe.confirmCardPayment(secret, paymentData);

        if (!payload.error) {
            const pi = payload.paymentIntent;
            if (pi) {
                pi.amount && data.save(saveKey, 'amount', (pi.amount / 100).toFixed(2));
                pi.currency && data.save(saveKey, 'currency', pi.currency);
                pi.id && data.save(saveKey, 'id', pi.id);
                data.save(saveKey, 'title', title);
                data.store();
                
                return;
            }
        } else {
            throw {"error": payload.error.message};
        }

        throw {"error": "Payment failed"}
    }

    PageForm(root, page, control, submit, rootSubmit);

}


