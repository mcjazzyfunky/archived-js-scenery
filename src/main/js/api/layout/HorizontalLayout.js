import {
    createElement as h,
    defineFunctionalComponent
} from 'js-surface';

import { Spec } from 'js-spec';

import { Seq } from 'js-essential';

export default defineFunctionalComponent({
    displayName: 'HorizontalLayout',

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
        const className = props.className;

        let sumFlex = 0;

        Seq.from(props.cells).forEach(cell => {
            const flex = cell.flex;

            sumFlex += flex === undefined ? 1 : flex;
        });

        return (
            h('.sc-HorizontalLayout',
                { className, style: { width: props.width, height: props.height } },
                h('.sc-HorizontalLayout-row',
                    { style: { width: props.width, height: props.height } },
                    Seq.from(props.cells).map((cell, key) => { 
                        const
                            flex = cell.flex === undefined ? 1 : cell.flex,
                            width = Math.floor(100 * flex / sumFlex) + '%',
                            height = cell.height === undefined ? '100%' : cell.height,
                            textAlign = cell.align === undefined ? 'auto' : cell.align,
                            verticalAlign = cell.valign === undefined ? 'auto' : cell.valign,
                            className = cell.className;

                        return (
                            h('.sc-HorizontalLayout-cell',
                                { key, className, style: { textAlign, verticalAlign, width, height } },
                                cell.content)
                        );
                    })))
        );
    }
});
