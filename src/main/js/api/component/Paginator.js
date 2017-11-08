import TextField from './TextField';
import PaginationUtils from '../../internal/util/PaginationUtils';

import { defineFunctionalComponent, createElement as h } from 'js-glow';
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

        disabled: {
            type: Boolean,
            defaultValue: false
        },

        onChange: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    render(props) {
        const { 
            pageIndex, pageSize, totalItemCount,
            className, type, disabled
        } = props;

        let ret = null;
        
        const
            details = PaginationUtils.preparePaginationDetails(
                pageIndex, pageSize, totalItemCount,
                { className, disabled });


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
            // This should never happen!
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
            paginationInfo.lastButtonIndex === details.pageCount - 2
                ? null
                : createEllipsisButton(
                    Math.min(details.pageCount - 1,
                        paginationInfo.lastButtonIndex
                        + Math.floor(paginationInfo.maxPageButtonCount / 2) - 1),
                    details, onClick),
        
        nextPageButton = createNextPageButton(details, onClick),

        lastPageButton = createPageButton(details.pageCount - 1, details, onClick);

    return (
        h('.sc-Paginator.sc-Paginator--standard > .sc-Paginator-row',
            Seq.of(
                previousPageButton,
                firstPageButton,
                precedingEllipsisLink,
                ...otherPageButtons, 
                succeedingEllipsisLink,
                lastPageButton,
                nextPageButton)
            
                .map((item, key) =>
                    h('div.sc-Paginator-cell',
                        { key },    
                        item))
        )
    );
}

function createSimplePaginator(props, details) {
    const
        onClick = createClickHandler(props.onChange),
        // firstPageButton = createFirstPageButton(details, onClick),
        previousPageButton = createPreviousPageButton(details, onClick),
        nextPageButton = createNextPageButton(details, onClick),
        // lastPageButton = createLastPageButton(details, onClick),

        infoAboutPage = h('div',
            `${details.pageIndex + 1} / ${details.pageCount}`);
    
    return (
        h('.sc-Paginator.sc-Paginator--simple > .sc-Paginator-row',
            Seq.of(
                // firstPageButton, 
                previousPageButton,
                infoAboutPage,
                nextPageButton,
                // lastPageButton
                )
            
                .map((item, key) =>
                    h('div.sc-Paginator-cell',
                        { key },    
                        item)))
    );
}

function createAdvancedPaginator(props, details) {
    const
        onClick = createClickHandler(props.onChange),
        firstPageButton =  createFirstPageButton(details, onClick),
        previousPageButton = createPreviousPageButton(details, onClick),
        nextPageButton = createNextPageButton(details, onClick),
        lastPageButton = createLastPageButton(details, onClick),

        //pageNoControl = createPageInputField(details)
        pageNoControl =
            h('div',
                TextField({
                    className: 'sc-Paginator-pageTextField',
                    disabled: details.disabled,
                    onKeyDown: ev => {
                        const
                            value = ev.value,
                            keyCode = ev.keyCode,
                            source = ev.source;

                        if (keyCode === 13) {
                            const
                                targetPageIndex = Number.parseInt(value, 10) - 1;

                            source.setValue(details.pageIndex + 1);
                            
                            if (isNaN(value) || isNaN(targetPageIndex) || targetPageIndex < 0  || targetPageIndex > details.pageCount - 1) {
                            } else if (props.onChange) {
                                source.blur();

                                props.onChange({
                                    type: 'change',
                                    value: targetPageIndex
                                });
                            }
                        }
                    },
                    value: String(details.pageIndex + 1)
                }));

    return (
        h('.sc-Paginator.sc-Paginator--advanced > .sc-Paginator-row',
            Seq.of(
                firstPageButton,
                previousPageButton,
                'Page',
                pageNoControl,
                `of ${details.pageCount}`,
                nextPageButton,
                lastPageButton)

                .map((item, key) =>
                    h('.sc-Paginator-cell',
                        { key },
                        item))
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

            target.blur();

            onChange({
                type: 'change',
                value: pageIndex
            });
        };
    }

    return ret;
}

function createPageButton(pageIndex, details, onClick) {
    const attrs = {
        'data-page-index': pageIndex,
        disabled: true //details.disabled
    }; 
    
    let ret;

    if (pageIndex === details.pageIndex) {
        ret = 
            h('a.sc-Paginator-pageButton.sc-Paginator-pageButton--selected.k-primary.k-button.k-state-selected',
                attrs,
                pageIndex + 1);
    } else {
        attrs.onClick = onClick;        
    
        ret = (
            h('button.sc-Paginator-pageButton.k-button',
                attrs,
                pageIndex + 1)
        );
    }

    return ret;
}

function createEllipsisButton(pageIndex, details, onClick) {
    return (
        h('button.sc-Paginator-ellipsis.k-button',
            {
                'data-page-index': pageIndex,
                onClick
            },
            '...')
    );
}

function createFirstPageButton(details, onClick) {
    return (
        h('button.sc-Paginator-firstPageButton.k-button',
            {
                disabled: details.isFirstPage || details.disabled,
                'data-page-index': 0,
                onClick
            },
            h('span.fa.fa-lg.fa-angle-double-left'))
    );
}

function createPreviousPageButton(details, onClick) {
    return (
        h('button.sc-Paginator-previousPageButton.k-button',
            {
                disabled: details.isFirstPage || details.disabled,
                'data-page-index': details.pageIndex - 1,
                onClick
            },
            h('i.fa.fa-lg.fa-angle-left'))
    );
}

function createNextPageButton(details, onClick) {
    return (
        h('button.sc-Paginator-nextPageButton.k-button',
            {
                disabled: details.isLastPage || details.disabled,
                'data-page-index': details.pageIndex + 1,
                onClick
            },
            h('i.fa.fa-lg.fa-angle-right'))
    );
}

function createLastPageButton(details, onClick) {
    return (
        h('button.sc-Paginator-lastPageButton.k-button',
            {
                disabled: details.isLastPage || details.disabled,
                'data-page-index': details.pageCount - 1,
                onClick
            },
            h('i.fa.fa-lg.fa-angle-double-right'))
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

