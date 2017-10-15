import PaginationUtils from '../../internal/util/PaginationUtils';

import {
    hyperscript as h,
    defineFunctionalComponent
} from 'js-surface';

import { Spec } from 'js-spec';

export default defineFunctionalComponent({
    displayName: 'PaginationInfo',

    properties: {
        type: {
            type: String,
            constraint: Spec.oneOf('info-about-page', 'info-about-items')
        },

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
        }
    },

    render(props) {
        const
            details =
                PaginationUtils.preparePaginationDetails(
                    props.pageIndex,
                    props.pageSize,
                    props.totalItemCount),

            infoText =
                props.type === 'info-about-page'
                    ? buildInfoTextAboutPage(details)
                    : buildInfoTextAboutItems(details);
            
        return h('div.sc-PaginationInfo',
            infoText);
    }
});


function buildInfoTextAboutPage({ pageIndex, pageCount, valid }) {
    return valid
        ? `Page ${pageIndex + 1} of ${pageCount}`
        : null;
}

function buildInfoTextAboutItems({ pageIndex, pageSize, totalItemCount, valid }) {
    let infoText = null;
    
    if (valid) {
        const
            firstItemNo = pageIndex * pageSize + 1,
            lastItemNo = Math.min(firstItemNo + pageSize - 1, totalItemCount);

        infoText =
            `${firstItemNo} - ${lastItemNo} of ${totalItemCount} items`;
    }

    return infoText;
}
