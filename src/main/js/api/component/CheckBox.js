import {
    createElement as h,
    defineClassComponent
} from 'js-glow';

import { Spec } from 'js-spec';

let nextCheckBoxNo = 1;

export default defineClassComponent({
    displayName: 'CheckBox',

    properties: {
        text: {
            type: String,
            nullable: true,
            defaultValue: null
        },

        checked: {
            type: Boolean,
            defaultValue: false
        },

        disabled: {
            type: Boolean,
            defaultValue: false
        },

        onClick: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    constructor() {
        this.id = 'checkBox--' + nextCheckBoxNo++;
    },

    render() {
        const { onChange, text } = this.props;

        return (
            h('.sc-CheckBox',
                h('input[type=checkbox].sc-CheckBox-input',
                    { id: this.id, onChange }),
                h('label.sc-CheckBox-label',
                    { htmlFor: this.id },    
                    text))
        );
    }
});
