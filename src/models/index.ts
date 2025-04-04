import {ButtonName} from '../buttons.js';
import PowerAXBox from './powera-xbox-series-x-wired-controller-opp-black.js';
import XBoxWireless from './xbox-wireless-controller.js';

/**
 * @deprecated
 */
interface XBoxMapping {
	LEFT_BUMPER: ButtonName;
	RIGHT_BUMPER: ButtonName;
	LEFT_TRIGGER?: ButtonName;
	RIGHT_TRIGGER?: ButtonName;

	UP?: ButtonName;
	LEFT_STICK_UP?: ButtonName;
	LEFT_STICK_LEFT?: ButtonName;
	RIGHT?: ButtonName;
	DOWN?: ButtonName;
	LEFT_STICK_DOWN?: ButtonName;
	LEFT?: ButtonName;
	LEFT_STICK_RIGHT?: ButtonName;
	LEFT_STICK_PRESS?: ButtonName;

	DPAD_UP: ButtonName;
	DPAD_RIGHT: ButtonName;
	DPAD_DOWN: ButtonName;
	DPAD_LEFT: ButtonName;

	A: ButtonName;
	B: ButtonName;
	X: ButtonName;
	Y: ButtonName;

	RIGHT_STICK_UP?: ButtonName;
	RIGHT_STICK_RIGHT?: ButtonName;
	RIGHT_STICK_DOWN?: ButtonName;
	RIGHT_STICK_LEFT?: ButtonName;
	RIGHT_STICK_PRESS?: ButtonName;

	BACK?: ButtonName;
	START?: ButtonName;

	GUIDE?: ButtonName;
	SHARE?: ButtonName;
}

export interface UniversalMapping {
	L1: ButtonName;
	L2: ButtonName;
	R1: ButtonName;
	R2: ButtonName;

	LEFT_STICK_UP: ButtonName;
	LEFT_STICK_DOWN: ButtonName;
	LEFT_STICK_LEFT: ButtonName;
	LEFT_STICK_RIGHT: ButtonName;
	LEFT_STICK_PRESS: ButtonName;

	LEFT_BUTTONS_TOP: ButtonName;
	LEFT_BUTTONS_BOTTOM: ButtonName;
	LEFT_BUTTONS_LEFT: ButtonName;
	LEFT_BUTTONS_RIGHT: ButtonName;

	RIGHT_BUTTONS_TOP: ButtonName;
	RIGHT_BUTTONS_BOTTOM: ButtonName;
	RIGHT_BUTTONS_LEFT: ButtonName;
	RIGHT_BUTTONS_RIGHT: ButtonName;

	RIGHT_STICK_UP: ButtonName;
	RIGHT_STICK_DOWN: ButtonName;
	RIGHT_STICK_LEFT: ButtonName;
	RIGHT_STICK_RIGHT: ButtonName;
	RIGHT_STICK_PRESS: ButtonName;

	MIDDLE_LEFT: ButtonName;
	MIDDLE_RIGHT: ButtonName;

	MIDDLE_TOP?: ButtonName;
	MIDDLE_BOTTOM?: ButtonName;
}

export type Modes = {
	primary?: (keyof UniversalMapping)[];
	secondary?: (keyof UniversalMapping)[];
	tertiary?: (keyof UniversalMapping)[];
};

export interface GamepadModel {
	name: string;
	mapping: UniversalMapping;
	modes?: Modes;
}

const models = {
	[PowerAXBox.name]: PowerAXBox,
	[XBoxWireless.name]: XBoxWireless,
};

export function getModelInformation(name: string) {
	const model = models[name];
	if (!model) {
		throw new Error(
			`Model "${name}" not available yet. Please report at https://github.com/vdegenne/mini-gamepad/issues.`,
		);
	}
	return model;
}
export function getMappingFromModel(modelName: string) {
	const model = getModelInformation(modelName);
	return model.mapping;
}
