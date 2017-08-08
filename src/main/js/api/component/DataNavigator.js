import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import { Spec }
    from 'js-spec';

import { Seq }
    from 'js-essential';

import DataTable from './DataTable';
import Paginator from './Paginator';
import PageSizeSelector from './PageSizeSelector';
import PaginationInfo from './PaginationInfo';
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

    render() {
        const
            config = this.props.config,
            data = this.props.data,
            toolbar = createToolbar(config),
            footer = createFooter();

        return h('div.sc-DataNavigator',
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
        Paginator({
            type: 'advanced',
            pageIndex: 1,
            pageSize: 25,
            totalItemCount: 1225
        }));
}

function createPageSizeSelector(config) {

    return PageSizeSelector({
        pageSize: 25
    });
}

function createFooter(config) {
    return (
        h('div.sc-DataNavigator-footer',
            createPaginator(config),
            createPageSizeSelector(config),
            PaginationInfo({
                type: 'info-about-items',
                pageIndex: 0,
                pageSize: 25,
                totalItemCount: 1225
            }))
    );
}