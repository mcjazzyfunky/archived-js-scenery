import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import { Seq } from 'js-essential';

import SelectBox from '../../main/js/api/component/SelectBox';
import TextField from '../../main/js/api/component/TextField';
import CheckBox from '../../main/js/api/component/CheckBox';

export default defineClassComponent({
    displayName: 'SceneOfFormFields',

    constructor() {
        this.state = {
            options: ['Option 1', 'Option 2', 'Option 3'],
            selectedOption: 'Option 2',
            disabled: false
        };
    },

    addOption() {
        const newOptions = this.state.options .slice();

        newOptions.push('Option ' + (this.state.options.length + 1));

        this.state = Object.assign({}, this.state, {
            options: newOptions
        });
    },

    selectOption(option) {
        this.state = Object.assign({}, this.state, {
            selectedOption: option
        });
    },

    setDisabled(disabled) {
        this.state = Object.assign({}, this.state, {
            disabled
        });
    },

    render() {
        return (
            h('div',
                h('div',
                    SelectBox({
                        value: this.state.selectedOption,
                        options: this.state.options,
                        disabled: this.state.disabled,
                        className: 'demo-select-box',
                        onChange: ev =>
                            console.log('Change event:', ev)
                    }),
                    h('button.k-button',
                        { onClick: this.addOption },
                        'Add option'),
                    h('button.k-button',
                        { onClick: () => this.selectOption('Option 1') },
                        'Select "Option 1"'),
                    h('button.k-button',
                        { onClick: () => this.selectOption('Option 3') },
                        'Select "Option 3"'),
                    h('button.k-button',
                        { onClick: () => this.setDisabled(!this.state.disabled) },
                        this.state.disabled ? 'Enable' : 'Disable' )),
                h('div',
                    'Some text field:',
                    TextField({ defaultValue: 'xxx'})),
                h('hr'),
                h('div', CheckBox({ text: 'Click me'} ),
                    h('div', CheckBox({ text: 'Yeah' } ))))
        );
    }
});