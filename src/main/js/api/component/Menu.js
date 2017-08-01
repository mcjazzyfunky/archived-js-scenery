import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import { Spec } from 'js-spec';
import { Seq } from 'js-essential';
import jQuery from 'jquery';
import ComponentHelper from '../helper/ComponentHelper';

const menuItemSpec = Spec.or(
    Spec.shape({
        text: Spec.string,
        icon: Spec.optional(Spec.string),
        disabled: Spec.optional(Spec.boolean),
        callback: Spec.optional(Spec.function)
    }),

    Spec.shape({
        text: Spec.string,
        icon: Spec.optional(Spec.string),
        className: Spec.optional(Spec.string),
        items:
            Spec.optional(
                Spec.arrayOf(
                    Spec.lazy(() => menuItemSpec)))
    })
);

export default defineClassComponent({
    displayName: 'Menu',

    properties: {
        items: {
            constraint: Spec.arrayOf(menuItemSpec)
        }
    },

    constructor() {
        this._nodeRef = null;
    },

    setNodeRef(ref) {
        this._nodeRef = ref;
    },

    onDidMount() {
        jQuery(this._nodeRef).kendoMenu();
    },

    onWillUpdate() {
        jQuery(this._nodeRef).data('kendoMenu').destroy();
    },

    onDidUpdate() {
        jQuery(this._nodeRef).kendoMenu();
    },

    onWillUnmount() {
        jQuery(this._nodeRef).data('kendoMenu').destroy();
    },

    render() {
        return h('div.sc-Menu > ul.k-widget.k-reset.k-header.k-menu.k-menu-horizontal',
            {
                className: this.props.className,
                ref: ref => this.setNodeRef(ref),
            },    
            createItems(this.props.items));
    }
});

function createItems(items, level = 0) {
    const ret = Seq.from(items).map(item => {
        let subMenu = null, icon = null;
      
        if (item.items) {
            subMenu = h('ul',
                { style: { display: 'none' } },
                createItems(item.items, level + 1));
        }

        if (item.icon) {
            icon = ComponentHelper.createIconElement(item.icon);
        }

        return (
            h('li.k-item[role=menuitem]',
                { className: item.disabled ? 'k-state-disabled' : null },
                h('span.k-link',
                    icon,
                    item.text,
                    item.items && level === 0
                        ? h('span.k-icon.k-i-arrow-60-down')
                        : null
                ),
                subMenu)
        );
    });

    return ret;
}
