import {
    createElement as h,
    defineFunctionalComponent
} from 'js-surface';

import {
    TextField,
    ComponentUtils
} from 'js-scenery';

export default defineFunctionalComponent({
    displayName: 'StandardLogin',

    properties: {
        logo: {
            type: String,
            nullable: true,
            defaultValue: null
        },

        title: {
            type: String,
            nullable: true,
            defaultValue: null
        },

        subtitle: {
            type: String,
            nullable: true,
            defaultValue: null
        },
        
        loginWithEmail: {
            type: Boolean,
            defaultValue: false
        }
    },
    
    render(props) {
        return (
            h('.SimpleLogin',
                h)
        )
    }
}); 