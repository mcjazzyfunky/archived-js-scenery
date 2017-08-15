import {
    createElement as h,
    defineClassComponent,
    defineFunctionalComponent
} from 'js-surface';

import SceneOfButtons from '../scenes/SceneOfButtons';
import SceneOfFormFields from '../scenes/SceneOfFormFields';
import SceneOfPaginations from '../scenes/SceneOfPaginations';
import SceneOfDataTables from '../scenes/SceneOfDataTables';
import SceneOfLayouts from '../scenes/SceneOfLayouts';

import HorizontalLayout from '../../main/js/api/layout/HorizontalLayout';
import VerticalLayout from '../../main/js/api/layout/VerticalLayout';

import ComponentHelper from '../../main/js/api/helper/ComponentHelper';

export default defineClassComponent({
    displayName: 'DemoApp',

    render() {
        const
            cells =
                [
                    {
                        content: Toolbar({
                            brand: 'Insight',
                            logo: 'fa-line-chart',
                            slogan: 'Keep your business in view'
                        }),
                        flex: 0
                    },
                    {
                        content:
                            HorizontalLayout({
                                cells: [
                                    {
                                        content: Sidebar(),
                                        flex: 0
                                    },
                                    {
                                        content: SceneOfDataTables(),
                                        className: 'app-inset' 
                                    }
                                ]           
                            })
                    }
                ];
 
        return (
            VerticalLayout({
                cells
            })
        );
    }
});

const Toolbar = defineFunctionalComponent({
    displayName: 'Toolbar',

    properties: {
        brand: {
            type: String
        },

        logo: {
            type: String
        },

        slogan: {
            type: String,
            nullable: true,
            defaultValue: null
        }
    },

    render(props) {
        return (
            HorizontalLayout({
                className: 'app-Toolbar',
                
                cells: [
                    {
                        content:
                            ComponentHelper.createIconElement(props.logo),
                        
                        flex: 0,
                        className: 'app-Toolbar-logo'
                    },
                    {
                        content: props.brand,
                        flex: 0,
                        className: 'app-Toolbar-brand'
                    },
                    {
                        content: props.slogan,
                        flex: 1,
                        className: 'app-Toolbar-slogan',
                        valign: 'middle'
                    }
                ]
            })
        );
    }
});

const Sidebar = defineFunctionalComponent({
    displayName: 'Sidebar',

    render() {
        return h('.app-Sidebar', 'Sidebar');
    }
});
