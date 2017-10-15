import { Strings } from 'js-essential';
import { hyperscript as h } from 'js-surface';

export default class ComponentUtils {
    static buildClass(...tokens) {
        let ret = '';

        for (let token of tokens) {
            if (typeof token === 'string' && token.length > 0) {
                if (ret.length > 0) {
                    ret += ' ';
                }

                ret += token;
            } else if (token instanceof Array) {
                for (let subtoken of token) {
                    let subCssClass = ComponentUtils.buildClass(subtoken);

                    if (ret.length > 0) {
                        ret += ' ';
                    }

                    ret += subCssClass;
                }
            }
        }

        return ret;
    }

    static buildIconClass(icon) {
        let ret = '';

        if (icon && typeof icon === 'string') {
            if (icon.startsWith('k-')) {
                ret = `k-icon k-i-${icon.substr(2)}`;
            } else if (icon.startsWith('fa-')) {
                ret = `fa ${icon}`;
            } else if (icon.startsWith('mdi-')) {
                ret = `mdi mdi-${icon}`;
            }
        }

        return ret;
    }
    
    static createIconElement(icon, className = null, style = null) {
        let ret = null;

        icon = Strings.trimToNull(icon);
        className = ComponentUtils.buildClass(className);

        if (icon !== null) {
            if (icon.startsWith('fa-')) {
                const fullClassName =
                    `${className} ${ComponentUtils.buildIconClass(icon)}`;

                ret = h('i', { className: fullClassName, style });
            } else if (icon.startsWith('k-')) {
                const fullClassName =
                    `k-icon ${className} ${ComponentUtils.buildIconClass(icon)}`;

                ret = h('i', { className: fullClassName, style });
            } else {
                ret = h('img', { href: icon, alt: '', className: className, style });
            }
        }

        return ret;
    }
}
