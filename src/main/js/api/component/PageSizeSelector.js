import SelectBox from './SelectBox';

import {
    createElement as h,
    defineFunctionalComponent
} from 'js-glow';

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

        disabled: {
            type: Boolean,
            defaultValue: true
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
                options: props.pageSizeOptions.map(String),
                disabled: props.disabled,
                onChange: ev => {
                    if (props.onChange) {
                        props.onChange({
                            type: 'change',
                            value: Number.parseInt(ev.value, 10)
                        });
                    }
                }
            });

        return (
            h('div.sc-PageSizeSelector > div.sc-PageSizeSelector-row',
                h('.sc-PageSizeSelector-cell > label', 'Items/Page:'),
                h('.sc-PageSizeSelector-cell', selectBox))
        );
    }
});
