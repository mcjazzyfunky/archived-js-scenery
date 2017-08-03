import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import { Spec } from 'js-spec';
import { Seq } from 'js-essential';
import jQuery from 'jquery';

export default defineClassComponent({
    displayName: 'SelectBox',

    properties: {
        value: {
            type: String
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
                ),
        },

        disabled: {
            type: Boolean,
            defaultValue: false
        },

        className: {
            type: String,
            nullable: true,
            defaultValue: null
        }
    },

    constructor() {
        this._selectNode = null;
    },

    setSelectNode(node) {
        this._selectNode = node;
    },

    decorateSelectNode() {
        if (this._selectNode) {
            const $select = jQuery(this._selectNode);
           
            $select.css('width', ($select.width() + 20) + 'px');

            $select.kendoDropDownList({
                autoWidth: true
            });
        }
    },

    undecorateSelectNode() {
        if (this._selectNode) {
            jQuery(this._selectNode).data('kendoDropDownList').destroy();
        }
    },

    onDidMount() {
        this.decorateSelectNode();
    },

    onWillUpdate() {
        this.undecorateSelectNode();
    },

    onDidUpdate() {
        this.decorateSelectNode();
    },

    onDidUnmount() {
        this.undecorateSelectNode();
    },

    render() {
        return (
            h('div.sc-SelectBox',
                { className: this.props.className },
                h('select',
                    { ref: node => this.setSelectNode(node) },
                    Seq.from(this.props.options).map(option =>
                        typeof option === 'string' || typeof option === 'number'
                            ? h('option', { value: option }, option)
                            : h('option', { value: option.value }, option.text)
                    )))
        );
    }
});
