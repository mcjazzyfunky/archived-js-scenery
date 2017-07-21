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
                    'page-size-selector',
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

        case 'page-size-selector':
            ret = createPageSizeSelector(metrics);
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
    }
});

function createDefaultPaginator(metrics) {
    const
        firstPageButton =  createFirstPageButton(),
        previousPageButton = createPreviousPageButton(),
        nextPageButton = createNextPageButton(),
        lastPageButton = createLastPageButton(),

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

function createPageButtonsPaginator(props) {
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

        firstPageButton = createFirstPageButton(metrics, 1),
        
        previousPageButton = createPreviousPageButton(metrics),
        
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
            paginationInfo.lastButtonIndex === metrics.pageCount
                ? null
                : h('a.item',
                    { onClick: createClickHandler(() => moveToPage(1))
                    },
                    '...'),
        
        nextPageButton = createNextPageButton(metrics),

        lastPageButton = createLastPageButton(metrics, metrics.pageCount);
console.log(paginationInfo)
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

function createPagerPaginator(metrics) {
    const
        firstPageButton = createFirstPageButton(metrics),
        previousPageButton = createPreviousPageButton(metrics),
        nextPageButton = createNextPageButton(metrics),
        lastPageButton = createLastPageButton(metrics),
        infoAboutPage = h('div.item.ui.large.label', buildInfoTextAboutPage(metrics));
    
    return (
        h('div.ui.text.menu',
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


function createFirstPageButton(metrics, text) {
    const
        isNumericText = !isNaN(text),

        children =
            isNumericText
                ? text
                : h('i.angle.double.left.icon.large');

    return (
        h('a.item.icon', children)
    );
}

function createPreviousPageButton(metrics) {
    return (
        h('a.item.icon',
            h('i.angle.left.icon.large'))
    );
}

function createNextPageButton(metrics) {
    return (
        h('a.item.icon',
            h('i.angle.right.icon.large'))
    );
}

function createLastPageButton(metrics, text = null) {
    const
        isNumericText = !isNaN(text),

        children =
            isNumericText
                ? text
                : h('i.angle.double.right.icon.large');
    return (
        h('a.item.icon',
            children)
    );
}

