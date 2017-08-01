import ComponentHelper from '../helper/ComponentHelper';

import { defineClassComponent, createElement as h } from 'js-surface';
import { Seq } from 'js-essential';
import { Spec } from 'js-spec';
import jQuery from 'jquery';

export default defineClassComponent({
    displayName: 'Pagination',

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

        mode: {
            type: String,
            constraint:
                Spec.oneOf(
                    'standard-paginator',
                    'simple-paginator',    
                    'advanced-paginator',
                    'page-size-selector',
                    'info-about-page',
                    'info-about-items'),
         
            defaultValue:
                'standard-paginator' 
        },
        
        className: {
            type: String,
            nullable: true,
            defaultValue: null
        }
    },

    constructor() {
        this._domElem = null;
    },

    onDidMount() {
        if (this._domElem) {
            const $select = jQuery(this._domElem).find('select');
           
            $select.css('width', ($select.width() + 20) + 'px');
            
            $select.kendoDropDownList({
                autoWidth: true
            });
        }
    },

    render() {
        const { pageIndex, pageSize, totalItemCount, className, mode} = this.props;

        let ret = null;
        
        const
            facts = gatherPaginationFacts(
                pageIndex, pageSize, totalItemCount, className);


        switch(mode) {
        case 'standard-paginator':
            ret = createStandardPaginator(facts);
            break;
        
        case 'simple-paginator':
            ret = createSimplePaginator(facts);
            break;
        
        case 'advanced-paginator':
            ret = createAdvancedPaginator(facts);
            break;

        case 'page-size-selector':
            ret = createPageSizeSelector(facts, elem => this.setDomElem(elem));
            break;
        
        case 'info-about-page':
            ret =
                h('div.item',
                     buildInfoTextAboutPage(facts));
            break;

        case 'info-about-items':
            ret =
                h('div',
                    { className },
                    buildInfoTextAboutItems(facts));
            
            break;

        default:
            // This should never happen
            throw new Error(`[Pagination] Illegal mode '${mode}'`);
        }

        return ret;
    },

    setDomElem(elem) {
        this._domElem = elem;
    }
});


function createStandardPaginator(facts) {
    const
        paginationInfo =
            determineVisiblePageButtons(
                facts.pageIndex,
                facts.pageCount,
                6),

        moveToPage = targetPage => {
            if (facts.onChange) {
                facts.onChange({targetPage});
            }
        },

        firstPageButton = createFirstPageButton(facts, 1),
        
        previousPageButton = createPreviousPageButton(facts),
        
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
                        h(index === facts.pageIndex ? 'button.ui.icon.primary.active.button' : 'div.item',
                            { onClick: createClickHandler(() => moveToPage(index)),
                                tabIndex: -1,
                                dataPage: index + 1,
                                key: index
                            },
                            index + 1)),
                    
        succeedingEllipsisLink =
            paginationInfo.lastButtonIndex === facts.pageCount
                ? null
                : h('div.item',
                    { onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
        
        nextPageButton = createNextPageButton(facts),

        lastPageButton = createLastPageButton(facts, facts.pageCount);

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

function createSimplePaginator(facts) {
    const
        firstPageButton = createFirstPageButton(facts),
        previousPageButton = createPreviousPageButton(facts),
        nextPageButton = createNextPageButton(facts),
        lastPageButton = createLastPageButton(facts),
        infoAboutPage = h('div.item.ui.large.label', buildInfoTextAboutPage(facts));
    
    return (
        h('div.ui.secondary.menu',
            firstPageButton, 
            previousPageButton,
            infoAboutPage,
            nextPageButton,
            lastPageButton)
    );
}

function createAdvancedPaginator(facts) {
    const
        firstPageButton =  createFirstPageButton(),
        previousPageButton = createPreviousPageButton(),
        nextPageButton = createNextPageButton(),
        lastPageButton = createLastPageButton(facts),

        pageNoControl =
            h('div.ui.input.item.small',
                h('input[type=text][size=3]'));

    return (
        h('div.sc-Pagination--advanced > table > tbody > tr',
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


function buildInfoTextAboutPage({ pageIndex, pageCount, valid }) {
    return valid
        ? `Page ${pageIndex + 1} of ${pageCount}`
        : null;
}

function createPageSizeSelector({ pageSize }, onRef ) {
    const sizes = [10, 25, 50, 100, 250, 500];

    return (
        h('div.sc-Pagination',
            { ref: onRef },
            'Items/page:',
            h('select',
                Seq.from(sizes).map(size => h('option', size))))
    );
}

function buildInfoTextAboutItems({ pageIndex, pageSize, totalItemCount, valid }) {
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


function createFirstPageButton(facts, text) {
    const
        isNumericText = text !== null && !isNaN(text),

        children =
            isNumericText
                ? text
                : h('span.k-icon.k-i-arrow-end-left');

    return (
        h('button.k-button', children)
    );
}

function createPreviousPageButton(facts) {
    return (
        h('button.k-button',
            h('span.k-icon.k-i-arrow-60-left'))
    );
}

function createNextPageButton(facts) {
    return (
        h('button.k-button',
            h('span.k-icon.k-i-arrow-60-right'))
    );
}

function createLastPageButton(facts, text = null) {
    const
        isNumericText = text !== null && !isNaN(text),
        children =
            isNumericText
                ? text
                : h('span.k-icon.k-i-arrow-end-right');

    return (
        h('button.k-button',
            children)
    );
}

// -----------------------------------

function gatherPaginationFacts(pageIndex, pageSize, totalItemCount, className) {
    const ret = {};

    ret.className = className;

    ret.pageIndex = isNaN(pageIndex) ? -1 : Math.max(-1, parseInt(pageIndex, 10));

    ret.pageSize = isNaN(pageSize)
        ? (pageSize === null || pageSize === Infinity ? Infinity : -1)
        : Math.floor(pageSize);

    if (ret.pageSize <= 0) {
        ret.pageSize = -1;
    }

    ret.totalItemCount = isNaN(totalItemCount) ? -1 : Math.max(-1, Number.parseInt(totalItemCount, 10));

    ret.pageCount = (ret.totalItemCount == -1 || ret.pageSize == -1)
        ? -1
        : Math.ceil(ret.totalItemCount / ret.pageSize);

    ret.isFirstPage = ret.pageIndex === 0;

    ret.isLastPage = ret.pageCount > 0 && ret.pageCount === ret.pageIndex + 1;

    ret.valid =
        ret.pageIndex >= 0
            && ret.pageCount >= 0
            && ret.pageSize > 0;

    return ret;
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
        lastButtonIndex: lastPageNumber - 1
    };
}

