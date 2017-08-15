import {
    createElement as h,
    defineFunctionalComponent
} from 'js-surface';

import { Spec } from 'js-spec';

import { Seq } from 'js-essential';

export default defineFunctionalComponent({
    displayName: 'VerticalLayout',

    properties: {
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
                    className: Spec.optional(Spec.string)
                }))
        }
    },

    render(props) {
        let sumFlex = 0;

        Seq.from(props.cells).forEach(cell => {
            const flex = cell.flex;

            sumFlex += flex === undefined ? 1 : flex;
        });
console.log('>>>', sumFlex);
        return (
            h('.sc-VerticalLayout',
                { style: { width: props.width, height: props.height } },
                Seq.from(props.cells).map((cell, key) => { 
                    const
                        flex = cell.flex === undefined ? 1 : cell.flex,
                        height = Math.floor(100 * flex / sumFlex) + '%',
                        className = cell.className;

                    return (
                        h('.sc-VerticalLayout-row',
                            { key, className, style: { height } },
                            h('.sc-VerticalLayout-cell',
                                cell.content))
                    );
                }))
        );
    }
});