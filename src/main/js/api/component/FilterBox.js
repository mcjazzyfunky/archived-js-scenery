import {
    hyperscript as h,
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
                cells: [
                    {
                        content: h('i.mdi.mdi-filter-outline', { style: { fontSize: '14px', color: '#7a7a7a' } }),
                        //content: h('i.fa.fa-filter', { style: { fontSize: '16px', color: '#888' } }),
                        
                        valign: 'top',
                        flex: 0
                    },
                    {
                        content:
                            h('div',
                                h('div > label', 'Last Name'),
                                h('div > input.k-text')),
                        
                        flex: 0
                    },
                    {
                        content:
                            h('div',
                                h('div > label', 'City'),
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
            { className: this.props.className },
            content);
    }
});
