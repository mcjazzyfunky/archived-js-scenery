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
            h('div.ui.three.column.grid',
                h('div.column.middle.aligned.left.aligned',
                    Pagination({
                        pageIndex: 2,
                        pageSize: 50,
                        totalItemCount: 1000,
                        mode: 'advanced-paginator'
                    })),

                h('div.stretched.column.middle.aligned',
                    Pagination({
                        pageIndex: 2, 
                        pageSize: 25,
                        totalItemCount: 1000,
                        mode: 'page-size-selector'
                    })),

                h('div.column.middle.aligned.right.aligned',
                    Pagination({
                        pageIndex: 2,
                        pageSize: 50,
                        totalItemCount: 1000,
                        mode: 'info-about-records'
                    }))),
            
        );
    } 
});