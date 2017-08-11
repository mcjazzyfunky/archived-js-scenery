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
            loadingErrMsg: null 
        };

        this.loadingStateAfterCancelledLoading = null;
        this.notifyCancelledLoading = null;
    },

    modifyState(modifications) {
        this.state = Object.assign({}, this.state, modifications);

        this.refresh(); // TODO
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

    loadData(params) {
        this.loadingStateAfterCancellation = this.state.loadingState;
        this.modifyState({ loadingState: 'loading' });

        const cancelNotifier = new Promise(resolve => {
            this.notifyCancelledLoading = () => {
                resolve();
            };
        });
        
        const enhancedParams = Object.assign({
            cancelNotifier
        }, params);

        this.props.loadData(enhancedParams)
            .then(result => this.handleCompletedLoading(params, result))
            .catch(error => this.handleFailedLoading(params, error));
    },

    cancelLoading() {
        const
            notifyCancelledLoading = this.notifyCancelledLoading,
            
            loadingStateAfterCancelledLoading =
                this.loadingStateAfterCancelledLoading;
        
        if (notifyCancelledLoading && loadingStateAfterCancelledLoading) {
            this.notifyCancelledLoading = null;
            this.loadingStateAfterCancellation = null;

            this.modifyState({
                loadingState: loadingStateAfterCancelledLoading
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
                loadingErrMsg: errMsg,
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
                pageSize
            });
        }
    },

    handleFailedLoading(params, error) {
        alert(error); // TODO
    },

    onDidMount() {
        const params = {
            itemCount: this.state.pageSize,
            offset: this.state.pageIndex * this.state.pageSize
        };

        this.loadData(params);
    },

    render() {
        const
            config = this.props.config,
            data = this.state.items || [],
            toolbar = this.createToolbar(config, this.state),
            footer = this.createFooter(config, this.state),
            dataOffset = this.state.pageIndex * this.state.pageSize;

        return h('div.sc-DataNavigator',
            toolbar,
            DataTable({ config, data, dataOffset }),
            footer
        );
    }, 

    // -----

    createToolbar(config) {
        const
            actionMenus = this.createActionMenus(config.actions),

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

    createActionMenus(actions) {
        const ret = [];

        for (const action of actions) {
            const
                menuConfig = { text: action.text, icon: action.icon },
                items = [menuConfig];

            if (action.actions) {
                menuConfig.items = this.buildActionMenuItems(action.actions);
            }

            ret.push(h('div.sc-DataNavigator-action', Menu({ items })));
        }

        return ret;
    },

    buildActionMenuItems(actions) {
        let ret = null;

        if (actions && actions.length > 0) {
            ret =
                Seq.from(actions).map(action => ({
                    text: action.text,
                    icon: action.icon,
                    items: this.buildActionMenuItems(action.actions) || undefined
                })).toArray();
        }

        return ret;
    },

    createPaginator(params) {
        const { pageIndex, pageSize, totalItemCount } = params;
        
        return h('div.sc-DataNavigator-paginator',
            Paginator({
                type: 'advanced',
                pageIndex,
                pageSize,
                totalItemCount,
                onChange: ev => this.moveToPage(ev.value)
            }));
    },

    createPageSizeSelector(state) {
        return PageSizeSelector({
            pageSize: state.pageSize,
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
    }
});