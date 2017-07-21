import ComponentHelper from '../helper/ComponentHelper';

import { defineFunctionalComponent, createElement as h } from 'js-surface';
import { Seq } from 'js-essential';
import { Spec } from 'js-spec';

export default defineFunctionalComponent({
    displayName: 'Pagination',

    properties: {
        pageIndex: {
            type: Number,
            constraint: Spec.nonnegativeInteger,
            nullable: true
        },

        pageSize: {
            type: Number,
            constraint: Spec.nonnegativeInteger, 
            nullable: true
        },
        
        totalItemCount: {
            type: Number,
            constraint: Spec.nonnegativeInteger,
            nullable: true
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
                    'info-about-records'),
         
            defaultValue:
                'standard-paginator' 
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
            facts = gatherPaginationFacts(
                props.pageIndex, props.pageSize, props.totalItemCount);


        switch(props.mode) {
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
            ret = createPageSizeSelector(facts);
            break;
        
        case 'info-about-page':
            ret = h('div.item', buildInfoTextAboutPage(facts));
            break;

        case 'info-about-records':
            ret = h('div.item', buildInfoTextAboutRecords(facts));
            break;

        default:
            // This should never happen
            throw new Error(`[Pagination] Illegal mode '${props.mode}'`);
        }

        return ret;
    }
});


function createStandardPaginator(props) {
    const
        pageIndex = props.pageIndex,

        facts = gatherPaginationFacts(
            props.pageIndex,
            props.pageSize,
            props.totalItemCount),

        textGoToFirstPage = 'Go to first page',
        textGoToPreviousPage = 'Go to previous page',
        textGoToNextPage = 'Go to next page',
        textGoToLastPage = 'Go to next page',

        paginationInfo =
            determineVisiblePageButtons(
                props.pageIndex,
                facts.pageCount,
                6),

        moveToPage = targetPage => {
            if (props.onChange) {
                props.onChange({targetPage});
            }
        },

        firstPageButton = createFirstPageButton(facts, 1),
        
        previousPageButton = createPreviousPageButton(facts),
        
        precedingEllipsisLink =
            paginationInfo.firstButtonIndex === 1
                ? null
                : h('a.item',
                    { onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
                
        otherPageButtons =
            Seq.range(
                paginationInfo.firstButtonIndex ,
                paginationInfo.lastButtonIndex + 1)
                .map(
                    index =>
                        h(index === props.pageIndex ? 'button.ui.icon.primary.active.button' : 'a.item',
                            { onClick: createClickHandler(() => moveToPage(index)),
                                tabIndex: -1,
                                dataPage: index + 1,
                                key: index
                            },
                            index + 1)),
                    
        succeedingEllipsisLink =
            paginationInfo.lastButtonIndex === facts.pageCount
                ? null
                : h('a.item',
                    { onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
        
        nextPageButton = createNextPageButton(facts),

        lastPageButton = createLastPageButton(facts, facts.pageCount);

    return (
        h('div.ui.menu.text',
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
        h('div.ui.text.menu',
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
        h('div',
        h('div.ui.text.menu',
            firstPageButton,
            previousPageButton,
       // h('div.ui.text.menu',
            h('div.item', 'Page'),
            pageNoControl,
            h('div.item', 'of 1000'),
      //  h('div.ui.menu.xright.xfloated.tiny',
            nextPageButton,
            lastPageButton
        ))                                                                          
    );
}


function buildInfoTextAboutPage({ pageIndex, pageCount, valid }) {
    return valid
        ? `Page ${pageIndex + 1} of ${pageCount}`
        : null;
}

function createPageSizeSelector({ pageSize }) {
    return (
        h('div.ui.text.menu',
            h('label.item', 'Items/Page:'), 
            h('div.item.ui.inline.dropdown',
                h('div.text', '25'),
                h('i.dropdown.icon'),
                h('div.menu',
                    h('div.item', 10),
                    h('div.item', 25),
                    h('div.item', 50),
                    h('div.item', 100),
                    h('div.item', 250))))
    );
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


function createFirstPageButton(facts, text) {
    const
        isNumericText = text !== null && !isNaN(text),

        children =
            isNumericText
                ? text
                : h('i.angle.double.left.icon.large');

    return (
        h('a.item.icon', children)
    );
}

function createPreviousPageButton(facts) {
    return (
        h('a.item.icon',
            h('i.angle.left.icon.large'))
    );
}

function createNextPageButton(facts) {
    return (
        h('a.item.icon',
            h('i.angle.right.icon.large'))
    );
}

function createLastPageButton(facts, text = null) {
    const
        isNumericText = text !== null && !isNaN(text),
        children =
            isNumericText
                ? text
                : h('i.angle.double.right.icon.large');

    return (
        h('a.item.icon',
            children)
    );
}

// -----------------------------------

function gatherPaginationFacts(pageIndex, pageSize, totalItemCount) {
    const ret = {};

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

