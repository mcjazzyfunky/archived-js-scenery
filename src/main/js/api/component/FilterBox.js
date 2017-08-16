import {
    createElement as h,
    defineClassComponent,
} from 'js-surface';

import HorizontalLayout from '../layout/HorizontalLayout';

import { Spec } from 'js-spec';

export default defineClassComponent({
    displayName: 'FilterBox',

    properties: {
        config: {
            type: Object,
            constraint:
                Spec.shape({
                    filters:
                        Spec.array
                })
        },

        className: {
            type: String,
            nullable: true,
            defaultValue: null
        }
    },

    render() {
        const content =
            HorizontalLayout({
                className: 'sc-FilterBox',

                cells: [
                    {
                        content:
                            h('div',
                                h('div > label', 'Customer-No.'),
                                h('div > input.k-text')),
                        
                        flex: 0
                    },
                    {
                        content:
                            h('div',
                                h('div > label', 'Country'),
                                h('div > input.k-text')),
                        
                        flex: 0
                    }, 
                    {
                        content: h('button.k-button', h('i.fa.fa-search'), ' Search'),
                        flex: 1,
                        valign: 'middle'
                    }
                ]
            });

        return h('div.sc-FilterBox',
            content);
    }
});
