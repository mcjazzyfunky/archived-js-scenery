import ComponentHelper from '../helper/ComponentHelper';
import PaginationHelper from '../../internal/helper/PaginationHelper';

import { defineFunctionalComponent, createElement as h } from 'js-surface';
import { Seq } from 'js-essential';
import { Spec } from 'js-spec';

export default defineFunctionalComponent({
    displayName: 'Pagination',

    properties: {
        pageIndex: {
            type: Number,
            nullable: true,
            defaultValue: null
        },

        pageSize: {
            type: Number,
            nullable: true,
            defaultValue: null
        },
        
        totalItemCount: {
            type: Number,
            nullable: true,
            defaultValue: null
        },

        mode: {
            constraint:
                Spec.oneOf(
                    'default',
                    'pager',    
                    'page-buttons',
                    'info-about-page',
                    'info-about-records'),
         
            defaultValue:
                'default' 
        },
        
        className: {
            type: String,
            nullable: true,
            defaultValue: null
        }
    },

    render(props) {
        let ret = null;
        
        const
            metrics =
                PaginationHelper.calcPaginationMetrics(
                    props.pageIndex, props.pageSize, props.totalItemCount);


        switch(props.mode) {
        case 'page-buttons':
            ret = createPageButtonsPaginator(metrics);
            break;
        
        case 'pager':
            ret = createPagerPaginator(metrics);
            break;
        
        case 'info-about-page':
            ret = h('span', buildInfoTextAboutPage(metrics));
            break;

        case 'info-about-records':
            ret = h('span', buildInfoTextAboutRecords(metrics));
            break;

        default:
            ret = createDefaultPaginator(metrics);
        }

        return ret;
    },

    render2(props) {
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
                h('a.item',
                    { onClick: createClickHandler(() => moveToPage(0)),
                        ariaLabel: textGoToFirstPage,
                        text: textGoToFirstPage
                    },
                    h('span',
                        { className: 'k-icon k-i-seek-w' })),
            
            previousPageLink =
                h('a.item',
                    { onClick: createClickHandler(() => moveToPage()),
                        ariaLabel: textGoToPreviousPage,
                        text: textGoToPreviousPage
                    },
                    h('span')),
            
            precedingEllipsisLink =
                h('a.item',
                    { onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
                    
            buttons =
                Seq.range(
                    paginationInfo.firstButtonIndex ,
                    paginationInfo.lastButtonIndex + 1)
                    .map(
                        index =>
                            h('a.item',
                                { className: index === props.pageIndex ? 'k-state-selected' : 'k-link',
                                    onClick: createClickHandler(() => moveToPage(index)),
                                    tabIndex: -1,
                                    dataPage: index + 1,
                                    key: index
                                },
                                index + 1)),
                        
            succeedingEllipsisLink =
                h('a.item',
                    { onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
            
            nextPageLink = 
                h('a.item',
                    { onClick: createClickHandler(() => moveToPage(222)),
                        ariaLabel: textGoToNextPage,
                        title: textGoToNextPage
                    },
                    h('span',
                        { className: 'k-icon k-i-arrow-e' })),

            lastPageLink =
                h('a.item',
                    {  onClick: createClickHandler(() => moveToPage(222)),
                        ariaLabel: textGoToLastPage,
                        title: textGoToLastPage
                    },
                    h('span',
                        { className: 'k-icon k-i-seek-e' }));
        return (
            h('div.ui.horizontal.link.list.large',
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

function createDefaultPaginator(metrics) {
    const
        firstPageButton =  createFirstPageButton(),
        previousPageButton = createPreviousPageButton(),
        nextPageButton = createNextPageButton(),
        lastPageButton = createLastPageButton(),

        pageNoControl =
            h('div.ui.input.item',
                h('input[type=text][size=3]'));

    return (
//        h('div.ui.seven.column.grid.centered.middle.alinged', { style: { display: 'inline-block' }},
        h('div.ui.text.menu',
          // h('div.column',
                firstPageButton,
          //  ),
      //  h('div.column',
                previousPageButton,
          //  ),
          //  h('div.column',
                h('div.item', 'Page'),
                pageNoControl,
                h('div.item', 'of 1000'),
          //  ),
          //  h('div.column',
                nextPageButton,
          //  ),
          //  h('div.column',
                lastPageButton
          //  )
        )
    );
}

function createPageButtonsPaginator(props) {
    return null;
}

function createPagerPaginator(metrics) {
    const
        firstPageButton = createFirstPageButton(metrics),
        previousPageButton = createPreviousPageButton(metrics),
        nextPageButton = createNextPageButton(metrics),
        lastPageButton = createLastPageButton(metrics),
        infoAboutPage = h('span', buildInfoTextAboutPage(metrics));
    
    return (
        h('div.ui.text.menu.small',
            firstPageButton, 
            previousPageButton,
            infoAboutPage,
            nextPageButton,
            lastPageButton)
    );
}

function buildInfoTextAboutPage({ pageIndex, pageCount, valid }) {
    return valid
        ? `Page ${pageIndex + 1} of ${pageCount}`
        : null;
}

function buildInfoTextAboutRecords({ pageIndex, pageSize, totalItemCount, valid }) {
    let infoText = null;
    
    if (valid) {
        const
            firstItemNo = pageIndex * pageSize + 1,
            lastItemNo = Math.min(firstItemNo + pageSize - 1, totalItemCount);

        infoText =
            `Items ${firstItemNo} - ${lastItemNo} of ${totalItemCount}`;
    }

    return infoText;
}







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

function createFirstPageButton(metrics) {
    return (
        h('a.ui.item',
            h('i.angle.double.left.icon.large'))
    );
}

function createPreviousPageButton(metrics) {
    return (
        h('a.ui.item',
            h('i.angle.left.icon.large'))
    );
}

function createNextPageButton(metrics) {
    return (
        h('a.ui.item',
            h('i.angle.right.icon.large'))
    );
}

function createLastPageButton(metrics) {
    return (
        h('a.ui.item',
            h('i.icon.angle.double.right.large'))
    );
}

