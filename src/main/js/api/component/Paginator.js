import PaginationUtils from '../../internal/util/PaginationUtils';

import { defineFunctionalComponent, createElement as h } from 'js-surface';
import { Seq } from 'js-essential';
import { Spec } from 'js-spec';

export default defineFunctionalComponent({
    displayName: 'Paginator',

    properties: {
        pageIndex: {
            type: Number,
            constraint: Spec.nonnegativeInteger,
            nullable: true,
            defaultValue: null
        },

        pageSize: {
            type: Number,
            constraint: Spec.nonnegativeInteger, 
            nullable: true,
            defaultValue: null
        },
        
        totalItemCount: {
            type: Number,
            constraint: Spec.nonnegativeInteger,
            nullable: true,
            defaultValue: null
        },

        type: {
            type: String,
            constraint: Spec.oneOf('standard', 'simple', 'advanced')
        },
        
        className: {
            type: String,
            nullable: true,
            defaultValue: null
        },

        onChange: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    render(props) {
        const { pageIndex, pageSize, totalItemCount, className, type } = props;

        let ret = null;
        
        const
            details = PaginationUtils.preparePaginationDetails(
                pageIndex, pageSize, totalItemCount, { className });


        switch(type) {
        case 'standard':
            ret = createStandardPaginator(props, details);
            break;
        
        case 'simple':
            ret = createSimplePaginator(props, details);
            break;
        
        case 'advanced':
            ret = createAdvancedPaginator(props, details);
            break;

        default:
            // This should never happen
            throw new Error(`[Paginator] Illegal type '${type}'`);
        }

        return ret;
    }
});


function createStandardPaginator(props, details) {
    const
        paginationInfo =
            determineVisiblePageButtons(
                details.pageIndex,
                details.pageCount,
                6),

        onClick = createClickHandler(props.onChange),

        firstPageButton = createPageButton(0, details, onClick),
        
        previousPageButton = createPreviousPageButton(details, onClick),
        
        precedingEllipsisLink =
            paginationInfo.firstButtonIndex === 1
                ? null
                : createEllipsisButton(
                    Math.max(0, paginationInfo.firstButtonIndex
                        - Math.floor(paginationInfo.maxPageButtonCount / 2)),
                    details, onClick),
                
        otherPageButtons =
            Seq.range(
                paginationInfo.firstButtonIndex ,
                paginationInfo.lastButtonIndex + 1)
                .map(
                    index => createPageButton(index, details, onClick)),
                    
        succeedingEllipsisLink =
            paginationInfo.lastButtonIndex === details.pageCount
                ? null
                : createEllipsisButton(
                    Math.min(details.pageCount - 1,
                        paginationInfo.lastButtonIndex
                        + Math.floor(paginationInfo.maxPageButtonCount / 2) - 1),
                    details, onClick),
        
        nextPageButton = createNextPageButton(details, onClick),

        lastPageButton = createPageButton(details.pageCount - 1, details, onClick);

    return (
        h('div.sc-Paginator.sc-Paginator--standard',
            previousPageButton,
            firstPageButton,
            precedingEllipsisLink,
            otherPageButtons, 
            succeedingEllipsisLink,
            lastPageButton,
            nextPageButton,
        )
    );
}

function createSimplePaginator(props, details) {
    const
        onClick = createClickHandler(props.onChange),
        firstPageButton = createFirstPageButton(details, onClick),
        previousPageButton = createPreviousPageButton(details, onClick),
        nextPageButton = createNextPageButton(details, onClick),
        lastPageButton = createLastPageButton(details, onClick),
        infoAboutPage = h('div',
            `${details.pageIndex + 1} / ${details.pageCount}`);
    
    return (
        h('div.ui.secondary.menu',
            firstPageButton, 
            previousPageButton,
            infoAboutPage,
            nextPageButton,
            lastPageButton)
    );
}

function createAdvancedPaginator(props, details) {
    const
        onClick = createClickHandler(props.onChange),
        firstPageButton =  createFirstPageButton(details, onClick),
        previousPageButton = createPreviousPageButton(details, onClick),
        nextPageButton = createNextPageButton(details, onClick),
        lastPageButton = createLastPageButton(details, onClick),

        pageNoControl =
            h('div.ui.input.item.small',
                h('input[type=text][size=3]',
                    { value: details.pageIndex + 1 }));

    return (
        h('div.sc-Pagination.sc-Pagination--advanced > table > tbody > tr',
            h('td', firstPageButton),
            h('td', previousPageButton),
            h('td', 'Page'),
            h('td', { style: { padding: '0 10px'}}, pageNoControl),
            h('td', 'of ' + details.pageCount),
            h('td', nextPageButton),
            h('td', lastPageButton)
        )                                                                          
    );
}


function createClickHandler(onChange) {
    let ret = null;

    if (onChange) {
        ret = ev => {
            const
                target =
                    ev.target.tagName === 'BUTTON'
                        ? ev.target
                        : ev.target.parentNode,

                pageIndex = 
                    Number.parseInt(
                        target.getAttribute('data-page-index'), 10);

            onChange({
                type: 'change',
                value: pageIndex
            });
        };
    }

    return ret;
}

function createPageButton(pageIndex, details, onClick) {
    return (
        h('button.k-button',
            {
                className: pageIndex === details.pageIndex ? 'k-state-selected' : null,
                'data-page-index': pageIndex,
                onClick
            },
            pageIndex + 1)
    );
}

function createEllipsisButton(pageIndex, details, onClick) {
    return (
        h('button.k-button',
            {
                'data-page-index': pageIndex,
                onClick
            },
            '...')
    );
}

function createFirstPageButton(details, onClick) {
    return (
        h('button.k-button',
            {
                disabled: details.isFirstPage,
                'data-page-index': 0,
                onClick
            },
            h('span.fa.fa-angle-double-left'))
    );
}

function createPreviousPageButton(details, onClick) {
    return (
        h('button.k-button',
            {
                disabled: details.isFirstPage,
                'data-page-index': details.pageIndex - 1,
                onClick
            },
            h('span.fa.fa-angle-left'))
    );
}

function createNextPageButton(details, onClick) {
    return (
        h('button.k-button',
            {
                disabled: details.isLastPage,
                'data-page-index': details.pageIndex + 1,
                onClick
            },
            h('span.fa.fa-angle-right'))
    );
}

function createLastPageButton(details, onClick) {
    return (
        h('button.k-button',
            {
                disabled: details.isLastPage,
                'data-page-index': details.pageCount - 1,
                onClick
            },
            h('span.fa.fa-angle-double-right'))
    );
}

function determineVisiblePageButtons(pageIndex, pageCount, maxPageButtonCount) {
    const
        pageNumber = pageIndex + 1,
        pageButtonCount = Math.min(maxPageButtonCount, pageCount);

    var firstPageNumber,
        lastPageNumber;

    if (pageButtonCount === pageCount || pageNumber <= Math.round(pageButtonCount / 2)) {
        firstPageNumber = 2;
    } else if (pageCount - pageNumber < Math.round(pageButtonCount / 2)) {
        firstPageNumber = pageCount - pageButtonCount + 2;
    } else {
        firstPageNumber = pageNumber - Math.round(pageButtonCount / 2) + 2;
    }

    lastPageNumber = firstPageNumber + pageButtonCount - 3;

    return {
        pageButtonCount: pageButtonCount,
        firstButtonIndex: firstPageNumber - 1,
        lastButtonIndex: lastPageNumber - 1,
        maxPageButtonCount
    };
}

