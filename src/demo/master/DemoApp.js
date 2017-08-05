import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import SceneOfButtons from '../scenes/SceneOfButtons';
import SceneOfFormFields from '../scenes/SceneOfFormFields';
import SceneOfDataTables from '../scenes/SceneOfDataTables';

export default defineClassComponent({
    displayName: 'DemoApp',

    render() {
        return (
            h('div',
                SceneOfFormFields())
        );
    }
});