import ItemText from './items/ItemText';
import ItemInput from './items/ItemInput';
import ItemInputRadio from './items/ItemInputRadio';
import ItemInputCheck from './items/ItemInputCheck';
import ItemSeparator from './items/ItemSeparator';
import ItemButton from './items/ItemButton';
import ItemLink from './items/ItemLink';
import ItemExec from './items/ItemExec';
import ItemRenderIf from './items/ItemRenderIf';
import ItemSection from './items/ItemSection';
import ItemImage from './items/ItemImage';
import ItemEmbed from './items/ItemEmbed';
import ItemFetch from './items/ItemFetch';
import ItemAlertBox from './items/ItemAlertBox';
import ItemInputCard from './items/ItemInputCard';
import ItemFetchJs from './items/ItemFetchJs';

function Render(parent, item, control, rootSubmit) {

    if (!item) return null;

    switch (item.type) {
        case 'title':
        case 'subtitle':
        case 'question':
        case 'p':
        case 'code':
            return ItemText(parent, item, control);
        case 'image':
            return ItemImage(parent, item, control);
        case 'line':
        case 'space':
            return ItemSeparator(parent, item, control);
        case 'embed':
            return ItemEmbed(parent, item, control);
        case 'text':
        case 'name':
        case 'email':
        case 'phone':
        case 'number':
        case 'url':
        case 'textlong':
        case 'password':
            return ItemInput(parent, item, rootSubmit, control);
        case 'radio':
            return ItemInputRadio(parent, item, rootSubmit, control);
        case 'check':
            return ItemInputCheck(parent, item, rootSubmit, control);
        case 'button':
            return ItemButton(parent, item, control);
        case 'link':
            return ItemLink(parent, item, control);
        case 'exec':
            return ItemExec(parent, item, control);
        case 'render-If':
            return ItemRenderIf(parent, item, control, rootSubmit);
        case 'section':
            return ItemSection(parent, item, control, rootSubmit);
        case 'fetch':
            return ItemFetch(parent, item, control, rootSubmit)
        case 'fetch-js':
            return ItemFetchJs(parent, item, control, rootSubmit)
        case 'alert':
            return ItemAlertBox(item, control);

        case 'card':
            return ItemInputCard(parent, item, rootSubmit)
    }

    return null;
}

export function RenderList(parent, items, control, rootSubmit) {
    items.forEach(item => {
        Render(parent, item, control, rootSubmit);
    });
}
