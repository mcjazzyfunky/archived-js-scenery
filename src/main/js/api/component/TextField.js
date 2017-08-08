import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

export default defineClassComponent({
    displayName: 'TextField',

    properties: {
        value: {
            type: String,
            defaultValue: null
        },

        defaultValue: {
            type: String,
            defaultValue: null
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
        },

        onKeyPress: {
            type: Function,
            nullable: true,
            defaultValue: null
        },

        onKeyDown: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    publicMethods: {
        blur() {
            if (this._node) {
                this._node.blur();
            }
        },

        focus() {
            if (this._node) {
                this._node.focus();
            }
        },

        setValue(value) {
            this.setValue(value);
        }
    },

    constructor(props) {
        const value = props.value !== null
            ? props.value
            : (props.defaultValue || '');

        this.setValue(value);
        this._node = null;
    },

    setValue(value) {
        this.state = {
            value
        };
    },

    setNode(node) {
        this._node = node;
    },

    onChange(ev) {
        const
            target = ev.target,
            value = target.value,
            onChange = this.props.onChange;

        this.setValue(value);

        if (onChange) {
            onChange({
                type: 'change',
                source: this.component,
                value
            });
        }
    },

    onKeyPress(ev) {
        const
            target = ev.target,
            value = target.value, 
            keyCode = ev.keyCode,
            onKeyPress = this.props.onKeyPress;

        if (onKeyPress) {
            onKeyPress({
                type: 'keypress',
                source: this.component,
                value,
                keyCode
            });
        }
    },

    onKeyDown(ev) {
        const
            target = ev.target,
            value = target.value, 
            keyCode = ev.keyCode,
            onKeyDown = this.props.onKeyDown;

        if (onKeyDown) {
            onKeyDown({
                type: 'keydown',
                source: this.component,
                target,
                value,
                keyCode
            });
        }
    },

    onWillReceiveProps(nextProps) {
        if (nextProps.value !== null) {
            this.setValue(nextProps.value);
        }
    },

    render() {
        const
            { className } = this.props,
            { value } = this.state;

        return (
            h('.sc-TextField',
                {
                    className
                },
                h('input[type=text].k-textbox',
                    {
                        className: 'sc-TextField-input',
                        value,
                        onChange: this.onChange,
                        onKeyPress: this.onKeyPress,
                        onKeyDown: this.onKeyDown,
                        ref: this.setNode
                    }))
        );
    }
});
