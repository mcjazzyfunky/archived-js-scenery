import {
    createElement as h,
    defineClassComponent
} from 'js-surface';


import React from 'react';

console.log(React)

const start = Date.now();

for (let i = 0; i < 100000; ++i) {
    let x = React.createElement('div',
        { class: 'my-class', id: 'my-id' },
        React.createElement('div', { class: 'my-class2', id: 'my-id2'}, 'my-div'));    
}

const end = Date.now();


console.log('Duration:', (end - start) / 1000);

const start2 = Date.now();
const h2 = (...args) => React.createElement(...args);
for (let i = 0; i < 100000; ++i) {
//    let x = h('div.my-class#my-id > div.my-class2#my-id2', 'my-div');
    let x = h('div',
        { className: 'my-class', id: 'my-id' },
        h('div', { className: 'my-class2', id: 'my-id2'}, 'my-div'));    
}

const end2 = Date.now();

console.log('Duration2:', (end2 - start2) / 1000);

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
        columns: Spec.array,
        headline: Spec.optional(Spec.string)
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
            footer
        );
    } 
});

function createToolbar(config) {
    const
        actionMenus = createActionMenus(config.actions),

        headline = config.headline
            ? h('h4.sc-DataNavigator-headline', config.headline)
            : null;

    return (
        h('div.sc-DataNavigator-toolbar',
            headline,
            h('div.sc-DataNavigator-actions',
                actionMenus))
    ); 
}

function createActionMenus(actions) {
    const ret = [];

    for (const action of actions) {
        const
            menuConfig = { text: action.text, icon: action.icon },
            items = [menuConfig];

        if (action.actions) {
            menuConfig.items = buildActionMenuItems(action.actions);
        }

        ret.push(h('div.sc-DataNavigator-action', Menu({ items })));
    }

    return ret;
}

function buildActionMenuItems(actions) {
    let ret = null;

    if (actions && actions.length > 0) {
        ret =
            Seq.from(actions).map(action => ({
                text: action.text,
                icon: action.icon,
                items: buildActionMenuItems(action.actions) || undefined
            })).toArray();
    }

    return ret;
}

function createPaginator(config) {
    return h('div.sc-DataNavigator-paginator',
        Pagination({
            mode: 'advanced-paginator',
            pageIndex: 1,
            pageSize: 25,
            totalItemCount: 1225
        }));
}

function createPageSizeSelector(config) {

    return Pagination({
        mode: 'page-size-selector',
        pageSize: 25
    });

    return h('div.sc-DataNavigator-pageSizeSelector',
        h('label.sc-DataNavigator-pageSizeSelectorLabel', 'Items/page:'),
        Menu({
            //direction: 'top',

            items: [{
                text: `10`,
                
                items: 
                    Seq.of(10, 25, 50, 100, 250, 500).map(n => ({
                        text: n
                    })).toArray()
            }]
        })
    );
}

function createFooter(config) {
    return (
        h('div.sc-DataNavigator-footer',
            createPaginator(config),
            createPageSizeSelector(config),
            Pagination({
                mode: 'info-about-items',
                pageIndex: 0,
                pageSize: 25,
                totalItemCount: 1225
            }))
    );
}