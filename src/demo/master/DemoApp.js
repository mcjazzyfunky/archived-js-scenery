import {
    createElement as h,
    defineClassComponent,
    defineFunctionalComponent
} from 'js-surface';

import { Spec } from 'js-spec';
import { Seq } from 'js-essential';

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
                                        content: Sidebar({
                                            items: [
                                                {
                                                    text: 'Main Modules',
                                                    items: [
                                                        {
                                                            text: 'Dashboard',
                                                            icon: 'fa-dashboard'
                                                        },
                                                        {
                                                            text: 'User Management',
                                                            icon: 'fa-users'
                                                        },
                                                        {
                                                            text: 'File Management',
                                                            icon: 'fa-files-o'
                                                        }
                                                    ]
                                                }, 
                                                {
                                                    text: 'Content Management',
                                                    items: [
                                                        {
                                                            text: 'Web Pages',
                                                            icon: 'fa-globe'
                                                        }, 
                                                        {
                                                            text: 'Media',
                                                            icon: 'fa-file-movie-o'
                                                        },
                                                        {
                                                            text: 'SEO',
                                                            icon: 'fa-external-link'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }),
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



function buildItemsSpec(level =0) {
    let ret;

    const shape = {
        text: Spec.optional(Spec.string),
        icon: Spec.optional(Spec.string),
        disabled: Spec.optional(Spec.Boolean),
        onClick: Spec.optional(Spec.Function),
        version: Spec.optional(Spec.String),
    };

    if (level >= 2) {
        ret = Spec.shape(shape);
    } else {
        shape.items =
            Spec.optional(
                Spec.shape(
                    buildItemsSpec(level + 1)));
        
        ret =
            Spec.and(
                Spec.shape(shape),
                /*
                Spec.not(
                    Spec.struct({
                        items: Spec.something,
                        spec: Spec.something
                    })
                )
                */    
                );
    }

    return ret;
}
const Sidebar = defineFunctionalComponent({
    displayName: 'Sidebar',

    props: {
        items: {
            type: Object,
            constraint: buildItemsSpec()
        }
    },

    render(props) {
        return (
            h('.app-Sidebar',
                renderMenu(props.items))
        );
    }
});

function renderMenu(items) {
    let ret = null;

    if (items) {
        ret =
            h('ul',
                Seq.from(items).map(item => {
                    const
                        className =
                            item.items
                                ? 'app-Sidebar-menu'
                                : 'app-Sidebar-item',
                        
                        icon =
                            item.icon
                                ? ComponentHelper.createIconElement(item.icon)
                                : null;

                    return h('li',
                        { className },
                        icon,
                        h('label', item.text),
                        renderMenu(item.items));
                }));
    }

    return ret;
}
