import {
    hyperscript as h,
    defineFunctionalComponent
} from 'js-surface';

import { Seq } from 'js-essential';

import Button from '../../main/js/api/component/Button';

const
    buttonTypes = ['default', 'primary', 'secondary', 'positive', 'negative', 'flat', 'link'],
    sizes = ['mini', 'tiny', 'small', 'medium', 'large', 'huge', 'massive'],
    exampleIcons = ['fa-calendar', 'fa-twitter', 'fa-home', 'fa-print'],
    iconPositions = ['left', 'top'];


export default defineFunctionalComponent({
    displayName: 'SceneOfButtons',

    render() {
        return (
            h('div.ui.grid',
                h('div.row',
                    h('h3', 'Enabled buttons:')),
                h('div.row',
                    ...Seq.from(buttonTypes).map(buttonType =>
                        h('div.col-md-1',
                            Button({
                                text: buttonType,
                                type: buttonType,
                                onClick: () => alert('You clicked: ' + buttonType)
                            })))),
                h('div.row',
                    h('h3', 'Enabled buttons (outlined):')),
                h('div.row',
                    ...Seq.from(buttonTypes).map(buttonType =>
                        h('div.col-md-1',
                            Button({
                                text: buttonType,
                                type: buttonType,
                                outlined: true,
                                onClick: () => alert('You clicked: ' + buttonType)
                            })))),
                h('div.row',
                    h('h3', 'Disabled buttons:')),
                h('div.row',
                    ...Seq.from(buttonTypes).map(buttonType =>
                        h('div.col-md-1',
                            Button({
                                text: buttonType,
                                type: buttonType,
                                disabled: true
                            }))
                    )),

                h('div.row',
                    h('h3', 'Buttons with icons')),
                h('div.row',
                    ...Seq.from(exampleIcons).map(icon =>
                        h('div.col-md-1',
                            Button({text: icon.replace(/^[^-]+-/, ''), icon })))),
                h('div.row',
                    h('h3', 'Buttons with different icon positions')),
                h('div.row',
                    ...Seq.from(iconPositions).map(iconPosition =>
                        h('div.col-md-1',
                            Button({text: iconPosition, icon: 'fa-taxi', iconPosition: iconPosition})))),

                h('div.row',
                    h('h3', 'Links with different icon positions')),
                h('div.row',
                    ...Seq.from(iconPositions).map(iconPosition =>
                        h('div.col-md-1',
                            Button({
                                text: iconPosition,
                                icon: 'fa-taxi',
                                iconPosition: iconPosition,
                                type: 'link'
                            })))),
                h('div.row',
                    h('h3', 'Button sizes:')),
                h('div.row',
                    ...Seq.from(sizes).map(size =>
                        h('div.col-md-1',
                            Button({text: size, size })))),

                h('div.row',
                    h('h3', 'Link sizes:')),
                h('div.row',
                    ...Seq.from(sizes).map(size =>
                        h('div.col-md-1',
                            Button({text: size, size: size, type: 'link'})))),
                h('div.row',
                    h('h3', 'Menu buttons:')),
                h('div.row',
                    Button({
                        className: 'col-md-2',
                        type: 'default',
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
