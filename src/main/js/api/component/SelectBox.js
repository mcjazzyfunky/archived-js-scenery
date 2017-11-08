import {
    createElement as h,
    defineClassComponent
} from 'js-glow';

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
                    {
                        when:
                            it => it && typeof it[0] === 'string',
                        
                        check:
                            Spec.arrayOf( Spec.string),
                    },
                    {
                        when:
                            it => it && it[0] && typeof it[0] === 'object',
                        
                        check:
                            Spec.arrayOf(
                                Spec.shape({
                                    value: Spec.or(Spec.string, Spec.number),
                                    text: Spec.or(Spec.string, Spec.number)
                                }))
                    })
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

            const api =
                jQuery(this._selectNode)
                    .data('kendoDropDownList')
                
            if (api) {
                api.value(this._value);
            }
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
        // TODO
        if (this._selectNode && jQuery.fn.kendoDropDownList) {
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
                    this._normalizedOptions.map((option, key) =>
                        h('option',
                            {
                                value: option.value,
                                key
                            },
                            option.text)))) 
        );
    }
});
