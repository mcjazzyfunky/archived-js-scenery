import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import SceneOfButtons from '../scenes/SceneOfButtons';
import SceneOfFormFields from '../scenes/SceneOfFormFields';
import SceneOfPaginations from '../scenes/SceneOfPaginations';
import SceneOfDataTables from '../scenes/SceneOfDataTables';
import SceneOfLayouts from '../scenes/SceneOfLayouts';

export default defineClassComponent({
    displayName: 'DemoApp',

    render() {
        return (
            h('div',
                SceneOfLayouts())
        );
    }
});