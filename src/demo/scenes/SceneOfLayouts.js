import {
    createElement as h,
    defineFunctionalComponent
} from 'js-surface';

import VerticalLayout from '../../main/js/api/layout/VerticalLayout';

export default defineFunctionalComponent({
    displayName: 'SceneOfLayouts',

    render() {
        return (
            h('div',
                { style: { width: '800px', height: '900px', border: '1px solid green' } },
                VerticalLayout({
                    width: '100%',

                    cells: [
                        {
                            content: 'Cell1',
                            flex: 4
                        },
                        {
                            content: 'Cell2',
                            flex: 1
                        }
                    ]
                }))
        );
    }
});
