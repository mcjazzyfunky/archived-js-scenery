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
            footer
        );
    } 
});

function createToolbar(config) {
    const actionMenus = createActionMenus(config.actions);

    return (
        h('div.sc-DataNavigator-toolbar',
            actionMenus,
            createPaginator(config),
            createPageSizeSelector(config))
    ); 
}

function createActionMenus(actions) {
    const ret = [];

    for (const action of actions) {
        const items = [{ text: action.text, icon: action.icon }];

        ret.push(Menu({ items }));
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
    return h('div.sc-DataNavigator-pageSizeSelector',
        Pagination({
            mode: 'page-size-selector',
            pageSize: 25
        }));

    return h('div.sc-DataNavigator-pageSizeSelector',
        'Items/page:',
        Menu({
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

function createFooter() {
    return (
        h('div.sc-DataNavigator-footer',
            Pagination({
                mode: 'info-about-items',
                pageIndex: 0,
                pageSize: 25,
                totalItemCount: 1225
            }))
    );
}