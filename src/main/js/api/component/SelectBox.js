import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import { Spec } from 'js-spec';
import jQuery from 'jquery';

export default defineClassComponent({
    displayName: 'SelectBox',

    properties: {
        value: {
            type: String,
            nullable: true,
            defaultValue: null
        },

        defaultValue: {
            type: String,
            nullable: true,
            defaultValue: null
        },

        options: {
            type: Array,

            constraint:
                Spec.or(
                    Spec.arrayOf(
                        Spec.string),

                    Spec.arrayOf(
                        Spec.shape({
                            value: Spec.or(Spec.string, Spec.number),
                            text: Spec.or(Spec.string, Spec.number)
                        }))
                )
        },

        disabled: {
            type: Boolean,
            defaultValue: false
        },

        className: {
            type: String,
            nullable: true,
            defaultValue: null
        },

        onChange: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    constructor(props) {
        this._value =
            this.props.value !== null
                ? props.value
                : props.defaultValue;
            
        this._selectNode = null;
        this._stringifiedOptions = JSON.stringify(props.options);
        this._normalizedOptions = this.normalizeOptions(props.options);
    },

    onWillReceiveProps(nextProps) {
        if (nextProps.value !== null && this.value !== nextProps.value) {
            this._value = nextProps.value;

            jQuery(this._selectNode)
                .data('kendoDropDownList')
                .value(this._value);
        }

        if (nextProps.options) {
            const stringifiedOptions = JSON.stringify(nextProps.options);

            if (this._stringifiedOptions !== stringifiedOptions) {
                this._stringifiedOptions = stringifiedOptions;
                this._normalizedOptions = this.normalizeOptions(nextProps.options);
                
                jQuery(this._selectNode)
                    .data('kendoDropDownList')
                    .setDataSource(this._normalizedOptions);
            }
        }

        if (nextProps.disabled != this.props.disabled) {
            jQuery(this._selectNode)
                .data('kendoDropDownList')
                .enable(!nextProps.disabled);
        }
    },

    setSelectNode(node) {
        this._selectNode = node;
    },

    normalizeOptions(options) {
        return options.map(option => {
            const typeOfOption = typeof option;

            return typeOfOption === 'string' || typeOfOption === 'number'
                ? { value: String(option), text: String(option) }
                : { value: String(option.value), text: String(option.text) };
        });
    },

    kendoify() {
        if (this._selectNode) {
            jQuery(this._selectNode)
                .on('change', this.onChange)
                .kendoDropDownList({
                    autoWidth: true,
                    dataTextField: 'text',
                    dataValueField: 'value'
                });
        }
    },

    unkendoify() {
        if (this._selectNode) {
            jQuery(this._selectNode).data('kendoDropDownList').destroy();
        }
    },

    shouldUpdate() {
        return false;
    },

    onDidMount() {
        this.kendoify();
    },

    onWillUpdate() {
        this.unkendoify();
    },

    onDidUpdate() {
        this.kendoify();
    },

    onDidUnmount() {
        this.unkendoify();
    },

    onChange() {
        if (this.props.onChange) {
            this.props.onChange({
                type: 'change',
                value: this._selectNode.value
            });
        }
    },

    render() {
        return (
            h('div.sc-SelectBox',
                {
                    className: this.props.className,
                },
                h('select',
                    {
                        ref: this.setSelectNode,
                        value: this._value,
                        onChange: this.onChange,
                        disabled: this.props.disabled
                    },
                    this._normalizedOptions.map(option =>
                        h('option',
                            { value: option.value },
                            option.text)))) 
        );
    }
});
