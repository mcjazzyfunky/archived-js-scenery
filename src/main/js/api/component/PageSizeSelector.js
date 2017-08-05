import SelectBox from './SelectBox';

import {
    createElement as h,
    defineFunctionalComponent
} from 'js-surface';

import { Spec } from 'js-spec';

export default defineFunctionalComponent({
    displayName: 'PageSizeSelector',

    properties: {
        pageSize: {
            type: Number,
            constraint: Spec.nonnegativeInteger, 
            nullable: true
        },
        
        pageSizeOptions: {
            type: Array,
            constraint: Spec.arrayOf(Spec.nonnegativeInteger),
            defaultValue: [10, 25, 100, 250, 500]
        },

        onChange: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    render(props) {
        const selectBox =
            SelectBox({
                value: String(props.pageSize),
                options: props.pageSizeOptions,
                onChange: ev => {
                    if (props.onChange) {
                        props.onChange({
                            type: 'change',
                            value: Number.parseInt(ev.value, 10)
                        });
                    }
                }
            });

        return h('div.sc-PageSizeSelector',
            selectBox);
    }
});
