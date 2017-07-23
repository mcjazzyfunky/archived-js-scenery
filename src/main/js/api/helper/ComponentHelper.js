import { Strings } from 'js-essential';
import { createElement as h } from 'js-surface';

export default class ComponentHelper {
    static buildCssClass(...tokens) {
        let ret = '';

        for (let token of tokens) {
            if (typeof token === 'string' && token.length > 0) {
                if (ret.length > 0) {
                    ret += ' ';
                }

                ret += token;
            } else if (token instanceof Array) {
                for (let subtoken of token) {
                    let subCssClass = ComponentHelper.buildCssClass(subtoken);

                    if (ret.length > 0) {
                        ret += ' ';
                    }

                    ret += subCssClass;
                }
            }
        }

        return ret;
    }

    static buildIconCssClass(icon) {
        let ret = '';

        if (icon && typeof icon === 'string' && icon.indexOf('.') === -1) {
            let match = icon.match(/(?:^|\s)(fa)-./);

            if (match) {
                ret = match[1] + ' ' + icon;
            }
        }

        return ret;
    }
    
    static createIconElement(icon, className = null, style = null) {
        let ret = null;

        icon = Strings.trimToNull(icon);
        className = ComponentHelper.buildCssClass(className);

        if (icon !== null) {
            if (icon.startsWith('fa-')) {
                const fullClassName =
                    className + ' ui icon ' + icon.substr(3).replace('-', ' ');

                ret = h('i', { className: fullClassName, style });
            } else {
                ret = h('img', { href: icon, alt: '', className: className, style });
            }
        }

        return ret;
    }
}
