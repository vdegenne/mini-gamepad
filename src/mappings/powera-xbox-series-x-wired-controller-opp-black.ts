import {type GamepadModel} from './index.js';

const model: GamepadModel = {
	name: 'PowerA Xbox Series X Wired Controller OPP Black (Vendor: 20d6 Product: 2005)',

	mapping: {
		L1: 'button4',
		L2: 'axis2',
		R1: 'button5',
		R2: 'axis5',

		LEFT_STICK_UP: '-axis1',
		LEFT_STICK_RIGHT: '+axis0',
		LEFT_STICK_DOWN: '+axis1',
		LEFT_STICK_LEFT: '-axis0',
		LEFT_STICK_PRESS: 'button9',

		LEFT_BUTTONS_UP: '-axis7',
		LEFT_BUTTONS_RIGHT: '+axis6',
		LEFT_BUTTONS_DOWN: '+axis7',
		LEFT_BUTTONS_LEFT: '-axis6',

		RIGHT_BUTTONS_TOP: 'button3',
		RIGHT_BUTTONS_RIGHT: 'button1',
		RIGHT_BUTTONS_BOTTOM: 'button0',
		RIGHT_BUTTONS_LEFT: 'button2',

		RIGHT_STICK_UP: '-axis4',
		RIGHT_STICK_RIGHT: '+axis3',
		RIGHT_STICK_DOWN: '+axis4',
		RIGHT_STICK_LEFT: '-axis3',
		RIGHT_STICK_PRESS: 'button10',

		MIDDLE_LEFT: 'button6',
		MIDDLE_RIGHT: 'button7',

		MIDDLE_TOP: 'button8',

		// SHARE BUTTON DOESNT WORK?
		// MIDDLE_BOTTOM: '?'
	},
};

export default model;
