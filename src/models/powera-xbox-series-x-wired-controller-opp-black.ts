import {type GamepadModel} from './index.js';

const model: GamepadModel = {
	name: 'PowerA Xbox Series X Wired Controller OPP Black (Vendor: 20d6 Product: 2005)',

	mapping: {
		L1: 4,
		L2: 'axis2',
		R1: 5,
		R2: 'axis5',

		LEFT_STICK_UP: '-axis1',
		LEFT_STICK_RIGHT: '+axis0',
		LEFT_STICK_DOWN: '+axis1',
		LEFT_STICK_LEFT: '-axis0',
		LEFT_STICK_PRESS: 9,

		LEFT_BUTTONS_TOP: '-axis7',
		LEFT_BUTTONS_RIGHT: '+axis6',
		LEFT_BUTTONS_BOTTOM: '+axis7',
		LEFT_BUTTONS_LEFT: '-axis6',

		RIGHT_BUTTONS_TOP: 3,
		RIGHT_BUTTONS_RIGHT: 1,
		RIGHT_BUTTONS_BOTTOM: 0,
		RIGHT_BUTTONS_LEFT: 2,

		RIGHT_STICK_UP: '-axis4',
		RIGHT_STICK_RIGHT: '+axis3',
		RIGHT_STICK_DOWN: '+axis4',
		RIGHT_STICK_LEFT: '-axis3',
		RIGHT_STICK_PRESS: 10,

		MIDDLE_LEFT: 6,
		MIDDLE_RIGHT: 7,

		MIDDLE_TOP: 8,

		// SHARE BUTTON DOESNT WORK?
		// MIDDLE_BOTTOM: '?'
	},
};

export default model;
