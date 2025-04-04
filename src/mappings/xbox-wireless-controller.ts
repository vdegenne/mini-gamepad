import {type GamepadModel} from './index.js';

const model: GamepadModel = {
	name: 'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)',

	mapping: {
		L1: 'button4',
		L2: 'button6',
		R1: 'button5',
		R2: 'button7',

		LEFT_STICK_UP: '-axis1',
		LEFT_STICK_DOWN: '+axis1',
		LEFT_STICK_LEFT: '-axis0',
		LEFT_STICK_RIGHT: '+axis0',
		LEFT_STICK_PRESS: 'button10',

		LEFT_BUTTONS_TOP: 'button12',
		LEFT_BUTTONS_BOTTOM: 'button13',
		LEFT_BUTTONS_LEFT: 'button14',
		LEFT_BUTTONS_RIGHT: 'button15',

		RIGHT_BUTTONS_TOP: 'button3',
		RIGHT_BUTTONS_BOTTOM: 'button0',
		RIGHT_BUTTONS_LEFT: 'button2',
		RIGHT_BUTTONS_RIGHT: 'button1',

		RIGHT_STICK_UP: '-axis3',
		RIGHT_STICK_DOWN: '+axis3',
		RIGHT_STICK_LEFT: '-axis2',
		RIGHT_STICK_RIGHT: '+axis2',
		RIGHT_STICK_PRESS: 'button11',

		MIDDLE_LEFT: 'button8',
		MIDDLE_RIGHT: 'button9',

		// MIDDLE_TOP: '?',

		// SHARE BUTTON DOESNT WORK?
		// MIDDLE_BOTTOM: '?'
	},
};

export default model;
