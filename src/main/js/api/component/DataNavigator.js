import {
    createElement as h,
    defineClassComponent
} from 'js-glow';

import { Spec }
    from 'js-spec';

import { Seq }
    from 'js-essential';

import DataTable from './DataTable';
import Paginator from './Paginator';
import PageSizeSelector from './PageSizeSelector';
import PaginationInfo from './PaginationInfo';
import Menu from './Menu';
import HorizontalLayout from '../layout/HorizontalLayout';
//import FilterBox from './FilterBox';

import ComponentUtils from '../util/ComponentUtils';

const
    columnsSpec = 
        Spec.arrayOf( 
            Spec.or(
                {
                    when: it => it.columns === undefined,

                    check:
                        Spec.shape({
                            title: Spec.string,
                            field: Spec.string,
                            width: Spec.optional(Spec.string),
                            sortable: Spec.optional(Spec.boolean),
                            align:
                                Spec.optional(
                                    Spec.oneOf('left', 'right', 'center'))
                        }),
                },
                {
                    when: it => it.columns !== undefined,

                    check:
                        Spec.shape({
                            title: Spec.string,
                            columns: Spec.lazy(() => columnsSpec),
                            align:
                                Spec.optional(
                                    Spec.oneOf('left', 'right', 'center'))
                        })
                }
            )),
            
    actionSpec =
        Spec.or({
            when:
                it => it.actions === undefined,

            check:
                Spec.shape({
                    type: Spec.oneOf('general', 'single-row', 'multi-row'),
                    text: Spec.string,
                    icon: Spec.optional(Spec.string),
                    callback: Spec.optional(Spec.function),
                    ignore: Spec.optional(Spec.boolean)
                })
        },
        {
            when:
                it => it.actions,

            check:
                Spec.shape({
                    type: Spec.is('menu'),
                    text: Spec.string,
                    icon: Spec.optional(Spec.string),
                    actions: Spec.arrayOf(Spec.lazy(() => actionSpec)),
                    ignore: Spec.optional(Spec.boolean)                
                })
        }),    

    dataNavSpec = Spec.shape({
        headline: Spec.optional(Spec.string),
       
        selectionMode: Spec.oneOf('single', 'multi', 'none'),

        expandableRows:
            Spec.shape({
                getContent: Spec.function
            }),
        
        actions:
            Spec.optional(
                Spec.arrayOf(actionSpec)),
        
        columns: columnsSpec,
        filtering: Spec.optional(Spec.object)
    });

export default defineClassComponent({
    displayName: 'DataNavigator',

    properties: {
        config: {
            constraint: dataNavSpec
        },

        loadData: {
            type: Function
        },

        defaultPageSize: {
            type: Number,
            defaultValue: 10 
        },

        defaultPageIndex: {
            type: Number,
            defaultValue: 0      
        }
    },

    constructor(props) {
        this.state = {
            pageIndex: props.defaultPageIndex,
            pageSize: props.defaultPageSize,
            totalItemCount: 0,
            items: null,
            loadingState: 'init', // init, loading, loaded, error
            loadingErrMsg: null,
            sorting: null
        };

        this.loadingIndex = 0;
        this.loadingStateAfterCancellation = null;
        this.notifyCancelledLoading = null;
    },

    modifyState(modifications) {
        this.state = Object.assign({}, this.state, modifications);

        this.forceUpdate(); // TODO
    },

    moveToPage(pageIndex) {
        const
            params = {
                offset: pageIndex * this.state.pageSize,
                itemCount: this.state.pageSize
            };

        this.loadData(params);
    },

    selectPageSize(pageSize) {
        const
            params = {
                offset: 0,
                itemCount: pageSize
            };

        this.loadData(params);
    },

    loadData(params = null) {
        this.loadingStateAfterCancellation = this.state.loadingState;
        this.modifyState({ loadingState: 'loading' });

        const
            loadingIndex = this.loadingIndex,

            cancelNotifier = new Promise(resolve => {
                this.notifyCancelledLoading = () => {
                    setTimeout(() => {
                        resolve();
                    });
                };
            });
        
        const fullParams = Object.assign({
            itemCount: this.state.pageSize,
            offset: this.state.pageIndex * this.state.pageSize,
            sorting: this.state.sorting,
            cancelNotifier
        }, params);

        this.props.loadData(fullParams)
            .then(result => {
                if (this.loadingIndex === loadingIndex) {
                    this.handleCompletedLoading(fullParams, result);
                }
            })
            .catch(error => this.handleFailedLoading(fullParams, error));
    },

    cancelLoading() {
        ++this.loadingIndex;

        const
            notifyCancelledLoading = this.notifyCancelledLoading,
            
            loadingStateAfterCancellation =
                this.loadingStateAfterCancellation;

        if (notifyCancelledLoading && loadingStateAfterCancellation) {
            this.notifyCancelledLoading = null;
            this.loadingStateAfterCancellation = null;

            this.modifyState({
                loadingState: loadingStateAfterCancellation
            });

            notifyCancelledLoading();
        }
    },

    handleCompletedLoading(params, result) {
        if (result.error) {
            const
                errMsg = result.error.errorMessage;

            this.modifyState({
                loadingState: 'error',
                loadingErrMsg: errMsg
            });
        } else {
            const
                { items, totalItemCount } = result,
                pageSize = params.itemCount;

            this.modifyState({
                loadingState: 'loaded',
                items,
                totalItemCount,
                pageIndex: Math.floor(params.offset / pageSize),
                pageSize,
                sorting: params.sorting || null
            });
        }
    },

    handleFailedLoading(params, error) {
        throw error;
        alert(error); // TODO
    },

    onDidMount() {
        this.loadData();
    },

    render() {
        const
            config = this.props.config,
            data = this.state.items || [],
            toolbar = this.createToolbar(config, this.state),
            footer = this.createFooter(config, this.state),
            dataOffset = this.state.pageIndex * this.state.pageSize,
            isLoading = this.state.loadingState === 'loading',
            lockLayer = isLoading ? this.createLockPane() : null,
            loadingBox = isLoading ? this.createLoadingBox() : null,
            filterBox = this.createFilterBox(),

            tableConfig = {
                columns: config.columns
            };
            
        return h('.sc-DataNavigator',
            lockLayer,
            loadingBox,
            DataTable({
                className: 'sc-DataNavigator-dataTable',
                contentAbove: h('div', toolbar, filterBox),
                contentBelow: footer,
                config: tableConfig,
                data,
                dataOffset,
                sorting: this.state.sorting || null,
                onSort: ev => {
                    const
                        { field, direction } = ev,
                        pageIndex = this.state.pageIndex,
                        pageSize = this.state.pageSize,

                        params = {
                            itemCount: pageSize,
                            offset: 0,

                            sorting: {
                                field,
                                direction
                            }
                        };

                    this.loadData(params);
                }}),
        );
    }, 

    // -----

    createToolbar(config) {
        const
            actionMenus = this.createActionMenu(config.actions),

            headline = config.headline
                ? h('h4.sc-DataNavigator-headline', config.headline)
                : null;

        return (
            h('div.sc-DataNavigator-toolbar',
                headline,
                h('div.sc-DataNavigator-actions',
                    actionMenus))
        ); 
    },

    createActionMenu(actions) {
        const
            items = actions.map(action => {
                const config = {
                    text: action.text,
                    icon: action.icon,
                    disabled: false
                };

                if (action.actions) {
                    config.items = this.buildActionMenuItems(action.actions); 
                }

                return config;
            }),

            ret = h('div.sc-DataNavigator-action', Menu({ items }));

        return ret;
    },

    buildActionMenuItems(actions) {
        let ret = null;

        if (actions && actions.length > 0) {
            ret =
                Seq.from(actions).map(action => {
                    const ret = {
                        text: action.text,
                    };

                    if (action.icon) {
                        ret.icon = action.icon;
                    }

                    const items = this.buildActionMenuItems(action.actions);

                    if (items) {
                        ret.items = items;
                    }

                    return ret;
                }).toArray();
        }

        return ret;
    },

    createFilterBox() {
        return FilterBox({
            config: {
                className: 'sc-DataNavigator-filterBox',
                sections: [
                    {
                        filters: [
                            {
                                caption: 'Last Name',
                                field: 'lastName',
                                type: 'textField'
                            },
                            {
                                caption: 'Postal Code',
                                field: 'postalCode',
                                type: 'textField'
                            },
                            {
                                caption: 'City',
                                field: 'city',
                                type: 'textField'
                            },
                            {
                                caption: 'Last Name',
                                field: 'lastName',
                                type: 'textField'
                            },
                            {
                                caption: 'Postal Code',
                                field: 'postalCode',
                                type: 'textField'
                            },
                            {
                                caption: 'City',
                                field: 'city',
                                type: 'textField'
                            }
                        ]
                    }
                ]
            }
        });
    },

    createPaginator(params) {
        const { pageIndex, pageSize, totalItemCount } = params;
        
        return h('div.sc-DataNavigator-paginator',
            Paginator({
                type: 'advanced',
                pageIndex,
                pageSize,
                totalItemCount,
                disabled: this.state.loadingState === 'loading',
                onChange: ev => this.moveToPage(ev.value)
            }));
    },

    createPageSizeSelector(state) {
        return PageSizeSelector({
            pageSize: state.pageSize,
            disabled: this.state.loadingState === 'loading',
            onChange: ev => this.selectPageSize(ev.value)
        });
    },

    createFooter(config, state) {
        const { pageIndex, pageSize, totalItemCount } = state;

        return (
            h('div.sc-DataNavigator-footer > div.sc-DataNavigator-footer-inner',
                this.createPaginator(state),
                this.createPageSizeSelector(state),
                PaginationInfo({
                    type: 'info-about-items',
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    totalItemCount: totalItemCount
                }))
        );
    },

    createLockPane() {
        return (
            h('.sc-DataNavigator-lockPane')
        );
    },

    createLoadingBox() {
        const cancelButton =
            this.loadingStateAfterCancellation === 'init'
                ? null
                : h('button.sc-DataNavigator-loadingBox-cancel.k-button.k-primary',
                    { onClick: this.cancelLoading },
                    'Cancel');

        return (
            h('.sc-DataNavigator-loadingBox > .sc-DataNavigator-loadingBox-inner > .sc-DataNavigator-loadingBox-content',
                h('.sc-DataNavigator-loadingBox-leftArea',
                    h('i.fa.fa-spinner.fa-pulse.sc-DataNavigator-loadingBox-icon')),
                h('.sc-DataNavigator-loadingBox-rightArea',
                    h('div.sc-DataNavigator-loadingBox-text', 'Loading data ...'),
                    cancelButton))
        );
    }
});

const FilterBox = defineClassComponent({
    displayName: 'DataNavigator_FilterBox',

    // TODO
    properties: {
        config: {

        }
    },

    render() {
        const
            props = this.props,
            
            filters =
               Seq.from(props.config.sections[0].filters)
                   .filter(filter => filter.ignore != true)
                   .toArray(),

            maxFiltersPerColumn = Math.ceil(filters.length / 3),

            columns = [];

        let currColumn = null;

        for (let i = 0; i < filters.length; ++i) {
            if (i % maxFiltersPerColumn === 0) {
                currColumn = [];
                columns.push(currColumn);
            }

            currColumn.push(filters[i]);
        }

        const filterColumns = (
            h('.sc-DataNavigator-filterColumns',
                Seq.from(columns).map(column =>
                    h('.sc-DataNavigator-filterColumn',
                        Seq.from(column).map(filter =>
                            createFilter(filter))))));

        return h('div.sc-DataNavigator-filterBox',
            filterColumns);
    }
});

function createFilter({ caption, type }) {
    const
        label = h('label.sc-DataNavigator-filterLabel', caption),
        component = h('input[type=text]');

    return (
        h('div.sc-DataNavigator-filter',
            label,
            component)
    );
}
