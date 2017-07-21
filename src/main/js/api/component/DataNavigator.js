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
                        pageIndex: 2,
                        pageSize: 50,
                        totalItemCount: 1000,
                        mode: 'pager'
                    })),

                h('div.item',
                    Pagination({
                        pageIndex: 2, 
                        pageSize: 25,
                        totalItemCount: 1000,
                        mode: 'page-size-selector'
                    })),

                h('div.item',
                    Pagination({
                        pageIndex: 2,
                        pageSize: 50,
                        totalItemCount: 1000,
                        mode: 'info-about-records'
                    }))),
            
        );
    } 
});