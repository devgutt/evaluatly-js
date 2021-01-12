import { _ } from './Strings';
import { div } from './Html';

export default function C404() {

    return (
        div({}, [
            div({}, _('page.not_found'))
        ])
    );
}
