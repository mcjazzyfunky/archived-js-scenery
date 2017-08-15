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
                { style: { width: '800px', height: '200px', border: '1px solid green' } },
                VerticalLayout({
                    width: '100%',

                    cells: [
                        {
                            content: 'Cell1',
                            flex: 2
                        },
                        {
                            content: h('.boxed', 'Cell 2'),
                            align: 'right',
                            valign: 'bottom',
                            flex: 1
                        }
                    ]
                }))
        );
    }
});
