import {
    createElement as h,
    defineFunctionalComponent
} from 'js-surface';

import { Seq } from 'js-essential';

import Button from '../../main/js/api/component/Button';

const
    buttonTypes = ['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'],
    sizes = ['large', 'normal', 'small'],
    exampleIcons = ['fa-calendar', 'fa-twitter', 'glyphicon-home', 'glyphicon-print'],
    iconPositions = ['left', 'top', 'right', 'bottom'];


export default defineFunctionalComponent({
    displayName: 'SceneOfButtons',

    render() {
        return (
            h('div.container-fluid',
                h('div.row',
                    h('div.col-md-2',
                        'Enabled buttons:'),
                    ...Seq.from(buttonTypes).map(buttonType =>
                        h('div.col-md-1',
                            Button({
                                text: buttonType,
                                type: buttonType,
                                onClick: () => alert('You clicked: ' + buttonType)
                            })))),
                h('div.row',
                    h('div.col-md-2',
                        'Disabled buttons:'),
                    ...Seq.from(buttonTypes).map(buttonType =>
                        h('div.col-md-1',
                            Button({
                                text: buttonType,
                                type: buttonType,
                                disabled: true
                            }))
                    )),

                h('div.row',
                    h('div.col-md-2',
                        'Buttons with icons'),
                    ...Seq.from(exampleIcons).map(icon =>
                        h('div.col-md-1',
                            Button({text: icon.replace(/^[^-]+-/, ''), icon: icon})))),
                h('div.row',
                    h('div.col-md-2',
                        'Buttons with different icon positions'),
                    ...Seq.from(iconPositions).map(iconPosition =>
                        h('div.col-md-1',
                            Button({text: iconPosition, icon: 'fa-cab', iconPosition: iconPosition})))),

                h('div.row',
                    h('div.col-md-2',
                        'Links with different icon positions'),
                    ...Seq.from(iconPositions).map(iconPosition =>
                        h('div.col-md-1',
                            Button({
                                text: iconPosition,
                                icon: 'fa-cab',
                                iconPosition: iconPosition,
                                type: 'link'
                            })))),
                h('div.row',
                    h('div.col-md-2',
                        'Button sizes:'),
                    ...Seq.from(sizes).map(size =>
                        h('div.col-md-1',
                            Button({text: size, size: size})))),

                h('div.row',
                    h('div.col-md-2', 
                        'Link sizes:'),
                    ...Seq.from(sizes).map(size =>
                        h('div.col-md-1',
                            Button({text: size, size: size, type: 'link'})))),
                h('div.row',
                    h('div.col-md-2',
                        'Menu buttons:'),
                    Button({
                        className: 'col-md-2',
                        type: 'info',
                        text: 'Dropdown button',
                        menu: [{text: 'Item 1'}]
                    }),
                    Button({
                        className: 'col-md-2',
                        text: 'Split button',
                        onClick: () => alert('Juhuuu'),
                        menu: [{text: 'Item 1'}]
                    })))
        );
    }
});
