import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import { Spec }
    from 'js-spec';

import { Seq }
    from 'js-essential';

import DataTable from './DataTable';
import Pagination from './Pagination';
import Menu from './Menu';
import Button from './Button';

import ComponentHelper from '../helper/ComponentHelper';

const
    actionSpec =
        Spec.or(
            Spec.shape({
                type: Spec.oneOf('general', 'single-row', 'multi-row'),
                text: Spec.string,
                icon: Spec.optional(Spec.string),
                callback: Spec.function,
                ignore: Spec.optional(Spec.boolean)
            }),
            Spec.shape({
                type: Spec.is('menu'),
                text: Spec.string,
                actions: Spec.lazy(() => actionSpec),
                ignore: Spec.optional(Spec.boolean)                
            })
        ),    

    dataNavSpec = Spec.shape({
        actions: actionSpec,
        columns: Spec.array
    });

export default defineClassComponent({
    displayName: 'DataNaviagator',

    properties: {
        config: {
            constraint: dataNavSpec
        },

        data: {

        }
    },

    onRef(ref) {
        if (ref) {
     //       jQuery(ref).find('.sc-DataNavigator-toolbarMenu').kendoMenu();
        }
    },

    render() {
        const
            config = this.props.config,
            data = this.props.data,
            toolbar = createToolbar(config),
            footer = createFooter();

        return h('div.sc-DataNavigator',
            { ref: this.onRef },
            toolbar,
            DataTable({ config, data }),
            footer,
            Menu({
                items: [
                    {
                        text: 'Menu1'
                    },
                    {
                        text: 'Menu2'
                    },
                    {
                        text: 'Menu3',
                        items: [
                            {
                                text: 'Sub item1',
                                items: [
                                    {
                                        text: 'Sub sub item 1'
                                    },
                                    {
                                        text: 'Sub sub item 2'
                                    }
                                ]
                            },
                            {
                                text: 'Sub item2'
                            }

                        ]
                    }
                ]
            })
        );
    } 
});

function createToolbar(config) {
    // const actionElements = createActionElements(config.actions);

    //return h('div > ul.sc-DataNavigator-toolbar.k-widget.k-reset.k-header.k-menu.k-menu-horizontal',
    //    actionElements);

    return h('div',
        Seq.from(config.actions).map(createMenu));
}

function createActionElements(actions, level = 0) {
    const ret = Seq.from(actions).map(action => {
        const type = action.type;

        let item;

        if (type !== 'menu') {
            const { type, text, icon, callback } = action;

            item = h('li.k-item.k-state-default > span.k-link',
                ComponentHelper.createIconElement(icon),    
                text);
        } else {
            const { text, actions } = action;

            item =
                h('li.k-item',
                    h('span.k-link', text),
                    h('ul',
                        { style: { display: 'none' } },
                        createActionElements(actions, level + 1)));
        }

        return item;
    });

    return ret;
}

function createMenu(config) {
    const { type, text, icon, callback, actions } = config;


    return h('span > ul.sc-DataNavigator-toolbarMenu.k-widget.k-reset.k-header.k-menu.k-menu-horizontal',
        { style: { display: 'inline-block' }},    
        h('li.k-item',    
            ComponentHelper.createIconElement(icon),    
            text,
            !actions
                ? null
                : h('ul.k-widget.k-reset.k-menu',
                    { style: { display: 'none' } },
                    createActionElements(actions))));
}

function createFooter() {
    return (
        h('div.ui.items',
            Pagination({
                pageIndex: 2,
                pageSize: 50,
                totalItemCount: 1000,
                mode: 'advanced-paginator',
                className: 'sc-DataNavigator-Pagination item right floated'
            }))
    );
}