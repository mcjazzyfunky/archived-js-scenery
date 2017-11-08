import {
    createElement as h,
    defineClassComponent
} from 'js-glow';

import Paginator from '../../main/js/api/component/Paginator';
import PageSizeSelector from '../../main/js/api/component/PageSizeSelector';
import PaginationInfo from '../../main/js/api/component/PaginationInfo';

export default defineClassComponent({
    displayName: 'SceneOfPaginations',

    constructor() {
        this.state = {
            pageIndex: 0,
            pageSize: 25,
            totalItemCount: 1220,
            pageSizeOptions: [10, 25, 50, 100, 250, 500, 100000],
            disabled: false
        };
    },

    setPageSize(value) {
        this.state = Object.assign({}, this.state, {
            pageSize: value,
            pageIndex: 0
        });
    },

    setPageIndex(value) {
        this.state = Object.assign({}, this.state, {
            pageIndex: value
        });
    },

    setDisabled(value) {
        this.state = Object.assign({}, this.state, {
            disabled: value
        });
    },

    render() {
        return (
            h('div',
                Paginator({
                    type: 'standard',
                    pageIndex: this.state.pageIndex,
                    pageSize: this.state.pageSize,
                    totalItemCount: this.state.totalItemCount,
                    onChange: ev => this.setPageIndex(ev.value)
                }), 
                Paginator({
                    type: 'simple',
                    pageIndex: this.state.pageIndex,
                    pageSize: this.state.pageSize,
                    totalItemCount: this.state.totalItemCount,
                    onChange: ev => this.setPageIndex(ev.value)
                }),
                Paginator({
                    type: 'advanced',
                    pageIndex: this.state.pageIndex,
                    pageSize: this.state.pageSize,
                    totalItemCount: this.state.totalItemCount,
                    onChange: ev => this.setPageIndex(ev.value)
                }),
                PageSizeSelector({
                    pageSize: this.state.pageSize,
                    onChange: ev => this.setPageSize(ev.value)
                }),
                PaginationInfo({
                    type: 'info-about-page',
                    pageIndex: this.state.pageIndex,
                    pageSize: this.state.pageSize,
                    totalItemCount: this.state.totalItemCount
                }),
                PaginationInfo({
                    type: 'info-about-items',
                    pageIndex: this.state.pageIndex,
                    pageSize: this.state.pageSize,
                    totalItemCount: this.state.totalItemCount
                }))
        );
    }
});
