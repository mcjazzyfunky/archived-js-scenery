import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import { Spec }
    from 'js-spec';

import DataTable from './DataTable';
import Pagination from './Pagination';
import Button from './Button';

export default defineClassComponent({
    displayName: 'DataNaviagator',

    properties: ['config', 'data'],

    render() {
        const
            config = this.props.config,
            data = this.props.data,
            header = createHeader(),
            footer = createFooter();

        return h('div.sc-DataNavigator',
            header,
            DataTable({ config, data }),
            footer
        );
    } 
});

function createHeader() {
    const
        paginator =
            Pagination({
                mode: 'advanced-paginator',
                pageIndex: 1,
                totalItemCount: 1243,
                pageSize: 25
            }),

        pageSizeSelector =
            Pagination({
                mode: 'page-size-selector',
                pageIndex: 1,
                totalItemCount: 1243,
                pageSize: 25
            });

    return (
        /*
        h('div.sc-DataNavigator-headerxxx.ui.grid > div.row',
            h('div.ui.stretched.column > div.ui.secondary.menu',
                h('div.item', h('i.icon.plus'), 'New'),
                h('div.item', h('i.icon.edit'), 'Edit'),
                h('div.item', h('i.icon.delete'), 'Delete'),
                h('div.item', h('i.icon.print'), 'Print')),
            h('div.ui.column', paginator),
            h('div.ui.column', pageSizeSelector)
        */
        h('div.ui.menu',
            h('div.ui.item.left.floated', h('div.ui.fluid', 'Cell 1')),
            h('div.ui.item.right.floated', { style: { whiteSpace: 'nowrap'} }, "Cell 2 sddddddd sdds"),
            h('div.ui.item.right.floated', 'Cell3')
        )
    );
}

function createFooter() {
    return (
        h('div.ui.items',
            Pagination({
                pageIndex: 2,
                pageSize: 50,
                totalItemCount: 1000,
                mode: 'info-about-records',
                className: 'sc-DataNavigator-Pagination item right floated'
            }))
    );
}