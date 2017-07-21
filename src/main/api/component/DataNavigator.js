import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import { Spec }
    from 'js-spec';

import DataTable from './DataTable';
import Pagination from './Pagination';

export default defineClassComponent({
    displayName: 'DataNaviagator',

    properties: ['config', 'data'],

    render() {
        const
            config = this.props.config,
            data = this.props.data;

        return h('div',
            DataTable({ config, data }),
            h('div.ui.text.menu',
                h('div.item',
                    Pagination({
                        pageIndex: 0,
                        pageSize: 50,
                        totalItemCount: 1000,
                        mode: 'default'
                    })),
                h('div.item', 'Items/Page: '),
                h('div.item.ui.inline.dropdown',
                    h('div.text', '25'),
                    h('i.dropdown.icon'),
                    h('div.menu',
                        h('div.item', 10),
                        h('div.item', 25),
                        h('div.item', 50),
                        h('div.item', 100),
                        h('div.item', 250))),

                h('div.item',
                    Pagination({
                        pageIndex: 0,
                        pageSize: 50,
                        totalItemCount: 1000,
                        mode: 'info-about-records'
                    }))),
            
        );
    } 
});