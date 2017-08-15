import {
    createElement as h,
    defineFunctionalComponent
} from 'js-surface';

import { Spec } from 'js-spec';

import { Seq } from 'js-essential';

export default defineFunctionalComponent({
    displayName: 'VerticalLayout',

    properties: {
        className: {
            type: String,
            nullable: true,
            defaultValue: null
        },

        width: {
            type: String,
            nullable: true,
            defaultValue: '100%'
        },

        height: {
            type: String,
            nullable: true,
            defaultValue: '100%'
        },

        cells: {
            type: Array,

            constraints: Spec.arrayOf(
                Spec.shape({
                    content: Spec.any,
                    flex: Spec.optional(Spec.nonnegativeInteger),
                    className: Spec.optional(Spec.string),
                    align: Spec.optional(
                        Spec.oneOf('left', 'center', 'right')),
                    
                    valign: Spec.optional(
                        Spec.oneOf('top', 'middle', 'bottom'))
                }))
        }
    },

    render(props) {
        let sumFlex = 0;

        Seq.from(props.cells).forEach(cell => {
            const flex = cell.flex;

            sumFlex += flex === undefined ? 1 : flex;
        });

        return (
            h('.sc-VerticalLayout',
                { style: { width: props.width, height: props.height } },
                Seq.from(props.cells).map((cell, key) => { 
                    const
                        flex = cell.flex === undefined ? 1 : cell.flex,
                        height = Math.floor(100 * flex / sumFlex) + '%',
                        textAlign = cell.align === undefined ? 'auto' : cell.align,
                        verticalAlign = cell.valign === undefined ? 'auto' : cell.valign,
                        className = cell.className;

                    return (
                        h('.sc-VerticalLayout-row',
                            { key, className, style: { height } },
                            h('.sc-VerticalLayout-cell',
                                { style: { textAlign, verticalAlign, height } },
                                cell.content))
                    );
                }))
        );
    }
});