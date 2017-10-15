import {
    hyperscript as h,
    defineClassComponent
} from 'js-import';

import { Spec } from 'js-spec';

function buildItemsSpec(level =0) {
    let ret;

    const shape = {
        text: Spec.optional(Spec.string),
        icon: Spec.optional(Spec.string),
        disabled: Spec.optional(Spec.Boolean),
        onClick: Spec.optional(Spec.Function),
        version: Spec.optional(Spec.String),
    };

    if (level >= 2) {
        ret = Spec.shape(shape);
    } else {
        shape.items =
            Spec.optional(
                Spec.shape(
                    buildItemsSpec(level + 1)));
        
        ret =
            Spec.and(
                Spec.shape(shape),
                Spec.not(
                    Spec.struct({
                        items: Spec.something,
                        spec: Spec.something
                    })
                ));
    }

    return ret;
}


export default defineClassComponent({
    displayName: 'VerticalMenu',

    properties: {
        items: buildItemsSpec()
    },
    
    construct() {
        
    },

    render() {

    }
});
