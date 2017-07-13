import {
    createElement as h,
    defineFunctionalComponent
} from 'js-surface';

export default defineFunctionalComponent({
    displayName: 'Button',
  
    properties: {
        text: {
            type: String,
            nullable: true,
            defaultValue: null
        },

        onClick: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    render(props) {
        return (

            h('button',
                { onClick: props.onClick },    
                props.text)
        );
    }
});
