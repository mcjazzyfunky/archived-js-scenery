import ComponentHelper from '../helper/ComponentHelper.js';
import PaginationHelper from '../helper/PaginationHelper.js';

import { defineFunctionalComponent, createElement as h } from 'js-surface';
import { Seq } from 'js-essential';
import { Spec } from 'js-spec';

export default defineFunctionalComponent({
    displayName: 'PaginationBar',

    properties: {
        type: {
            type: Spec.oneOf(''),
            nullable: true,
            defaultValue: null
        },
        
        pageIndex: {
            type: Spec.number,
            nullable: true,
            defaultValue: null
        },

        pageSize: {
            type: Spec.number,
            nullable: true,
            defaultValue: null
        },
        
        totalItemCount: {
            type: Spec.number,
            nullable: true,
            defaultValue: null
        },

        className: {
            type: Spec.string,
            nullable: true,
            defaultValue: null
        }
    },

    render({ props }) {
        const
            pageIndex = props.pageIndex,

            metrics =
                PaginationHelper.calcPaginationMetrics(
                    props.pageIndex,
                    props.pageSize,
                    props.totalItemCount),

            textGoToFirstPage = 'Go to first page',
            textGoToPreviousPage = 'Go to previous page',
            textGoToNextPage = 'Go to next page',
            textGoToLastPage = 'Go to next page',

            paginationInfo =
                PaginationHelper.determineVisiblePaginationButtons(
                    props.pageIndex,
                    metrics.pageCount,
                    6),

            moveToPage = targetPage => {
                if (props.onChange) {
                    props.onChange({targetPage});
                }
            },

            firstPageLink =
                h('a',
                    { className: 'k-link k-pager-nav k-pager-first k-state-disabled',
                        onClick: createClickHandler(() => moveToPage(0)),
                        ariaLabel: textGoToFirstPage,
                        text: textGoToFirstPage
                    },
                    h('span',
                        { className: 'k-icon k-i-seek-w' })),
            
            previousPageLink =
                h('a',
                    { className: 'k-link',
                        onClick: createClickHandler(() => moveToPage()),
                        ariaLabel: textGoToPreviousPage,
                        text: textGoToPreviousPage
                    },
                    h('span',
                        { className: 'k-icon k-i-arrow-w' })),
            
            precedingEllipsisLink =
                h('a',
                    { className: 'k-link',
                        onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
                    
            buttons =
                h('ul',
                    { className: 'k-pager-numbers k-reset' },
                    Seq.range(
                        paginationInfo.firstButtonIndex ,
                        paginationInfo.lastButtonIndex + 1)
                    .map(
                        index =>
                            h('li',
                                { key: index },
                                h('a',
                                    { className: index === props.pageIndex ? 'k-state-selected' : 'k-link',
                                      onClick: createClickHandler(() => moveToPage(index)),
                                      tabIndex: -1,
                                      dataPage: index + 1
                                    },
                                    index + 1)))),
                            
            succeedingEllipsisLink =
                h('a',
                    { className: 'k-link',
                      onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
            
            nextPageLink = 
                h('a',
                    { className: 'k-link',
                        onClick: createClickHandler(() => moveToPage(222)),
                        ariaLabel: textGoToNextPage,
                        title: textGoToNextPage
                    },
                    h('span',
                        { className: 'k-icon k-i-arrow-e' })),

            lastPageLink =
                h('a',
                    { className: 'k-link',
                        onClick: createClickHandler(() => moveToPage(222)),
                        ariaLabel: textGoToLastPage,
                        title: textGoToLastPage
                    },
                    h('span',
                        { className: 'k-icon k-i-seek-e' }));
        return (
            h('div',
                { className: 'k-pager-wrap k-grid-pager k-widget k-floatwrap',
                    dataRole: 'pager'
                },
                firstPageLink,
                previousPageLink,
                precedingEllipsisLink,
                buttons, 
                succeedingEllipsisLink,
                nextPageLink,
                lastPageLink
            )
        );
    }
});

function createClickHandler(onClick) {
    return event => {
        event.preventDefault();
        onClick();
    };
}

function getPaginationText(type, metrics) {
    let ret = null;
    
    switch (type) {
        case 'itemsXToY':
            ret = `Items ${metrics.firstItemIndex + 1} to ${metrics.lastItemIndex + 1}`;
            break;
            
        case 'pageX': {
            ret = `Page ${metrics.pageIndex + 1}`;
            break;
        }

        case 'pageXOfY':
            ret = `Page ${metrics.pageIndex + 1} of ${metrics.pageCount}`;
            break;
        
        default: 
            throw new Error(`[getPaginationText] Illegal type '${type}`);
    }
    
    return ret;
}
