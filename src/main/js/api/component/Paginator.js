import PaginationUtils from '../../internal/util/PaginationUtils';

import { defineFunctionalComponent, createElement as h } from 'js-surface';
import { Seq } from 'js-essential';
import { Spec } from 'js-spec';
import SelectBox from './SelectBox';

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

        moveToPage = targetPage => {
            if (details.onChange) {
                details.onChange({targetPage});
            }
        },

        firstPageButton = createFirstPageButton(details, 1, moveToPage),
        
        previousPageButton = createPreviousPageButton(details),
        
        precedingEllipsisLink =
            paginationInfo.firstButtonIndex === 1
                ? null
                : h('div.item',
                    { onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
                
        otherPageButtons =
            Seq.range(
                paginationInfo.firstButtonIndex ,
                paginationInfo.lastButtonIndex + 1)
                .map(
                    index =>
                        h(index === details.pageIndex ? 'button.ui.icon.primary.active.button' : 'div.item',
                            { onClick: createClickHandler(() => moveToPage(index)),
                                tabIndex: -1,
                                'data-page': index + 1,
                                key: index
                            },
                            index + 1)),
                    
        succeedingEllipsisLink =
            paginationInfo.lastButtonIndex === details.pageCount
                ? null
                : h('div.item',
                    { onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
        
        nextPageButton = createNextPageButton(details, moveToPage),

        lastPageButton = createLastPageButton(details, details.pageCount, moveToPage);

    return (
        h('div.ui.secondary.menu',
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
        moveToPage =
            pageIndex => {
                if (props.onChange) {
                    props.onChange({
                        type: 'change',
                        value: pageIndex
                    });
                }
            },

        firstPageButton = createFirstPageButton(details, null, moveToPage),
        previousPageButton = createPreviousPageButton(details, moveToPage),
        nextPageButton = createNextPageButton(details, moveToPage),
        lastPageButton = createLastPageButton(details, null, moveToPage),
        infoAboutPage = h('div.item.ui.large.label',
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
        firstPageButton =  createFirstPageButton(),
        previousPageButton = createPreviousPageButton(),
        nextPageButton = createNextPageButton(),
        lastPageButton = createLastPageButton(details),

        pageNoControl =
            h('div.ui.input.item.small',
                h('input[type=text][size=3]'));

    return (
        h('div.sc-Pagination.sc-Pagination--advanced > table > tbody > tr',
            h('td', firstPageButton),
            h('td', previousPageButton),
            h('td', 'Page'),
            h('td', { style: { padding: '0 10px'}}, pageNoControl),
            h('td', 'of 1000'),
            h('td', nextPageButton),
            h('td', lastPageButton)
        )                                                                          
    );
}




function createClickHandler(onClick) {
    return event => {
        event.preventDefault();
        onClick();
    };
}


function createFirstPageButton(details, text, moveToPage) {
    const
        isNumericText = text !== null && !isNaN(text),

        children =
            isNumericText
                ? text
                : h('span.k-icon.k-i-arrow-end-left');

    return (
        h('button.k-button',
            { onClick: () => moveToPage(0) },
            children)
    );
}

function createPreviousPageButton(details,moveToPage) {
    return (
        h('button.k-button',
            { onClick: () => moveToPage(details.pageIndex - 1) },
            h('span.k-icon.k-i-arrow-60-left'))
    );
}

function createNextPageButton(details, moveToPage) {
    return (
        h('button.k-button',
            { onClick: () => moveToPage(details.pageIndex + 1) },
            h('span.k-icon.k-i-arrow-60-right'))
    );
}

function createLastPageButton(details, text = null, moveToPage) {
    const
        isNumericText = text !== null && !isNaN(text),
        children =
            isNumericText
                ? text
                : h('span.k-icon.k-i-arrow-end-right');

    return (
        h('button.k-button',
            { onClick: () => moveToPage(details.pageCount - 1) },
            children)
    );
}

// -----------------------------------

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
        lastButtonIndex: lastPageNumber - 1
    };
}

