import {
    createElement as h,
    defineFunctionalComponent
} from 'js-glow';

import VerticalLayout from '../../main/js/api/layout/VerticalLayout';
import HorizontalLayout from '../../main/js/api/layout/HorizontalLayout';

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
                        },
                        {
                            content: createHorizontalLayout()
                        } 
                    ]
                }))
        );
    }
});

function createHorizontalLayout() {
    return (
        HorizontalLayout({
            cells: [
                {
                    content: h('div', '1111'),
                    //flex: 3,
                    align: 'center',
                    valign: 'middle'
                },
                {
                    content: h('div', '222'),
                    flex: 0,
                    valign: 'bottom'
                }
            ]
        })
    );
}