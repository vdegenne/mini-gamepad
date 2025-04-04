import {type GamepadModel} from './index.js';

const model: GamepadModel = {
	name: 'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)',

	mapping: {
		L1: 4,
		L2: 6,
		R1: 5,
		R2: 7,

		LEFT_STICK_UP: '-axis1',
		LEFT_STICK_DOWN: '+axis1',
		LEFT_STICK_LEFT: '-axis0',
		LEFT_STICK_RIGHT: '+axis0',
		LEFT_STICK_PRESS: 10,

		LEFT_BUTTONS_TOP: 12,
		LEFT_BUTTONS_BOTTOM: 13,
		LEFT_BUTTONS_LEFT: 14,
		LEFT_BUTTONS_RIGHT: 15,

		RIGHT_BUTTONS_TOP: 3,
		RIGHT_BUTTONS_BOTTOM: 0,
		RIGHT_BUTTONS_LEFT: 2,
		RIGHT_BUTTONS_RIGHT: 1,

		RIGHT_STICK_UP: '-axis3',
		RIGHT_STICK_DOWN: '+axis3',
		RIGHT_STICK_LEFT: '-axis2',
		RIGHT_STICK_RIGHT: '+axis2',
		RIGHT_STICK_PRESS: 11,

		MIDDLE_LEFT: 8,
		MIDDLE_RIGHT: 9,

		// MIDDLE_TOP: '?',

		// SHARE BUTTON DOESNT WORK?
		// MIDDLE_BOTTOM: '?'
	},

	modes: {
		primary: ['L2'],
		secondary: ['R2'],
		tertiary: ['R2', 'L2'],
	},
};

export default model;
