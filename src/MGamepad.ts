import {cquerySelector} from 'html-vision';
import {type ButtonName} from './buttons.js';
import {type GamepadModel, getModelInformation} from './models/index.js';
import {Mode, ModeManager} from './ModeManager.js';
import {type MiniGamepadOptions} from './options.js';

export interface ButtonsState {
	buttons: boolean[];
	axes: number[];
}

type EventDetails = {
	mode: Mode;
	/**
	 * For axes
	 */
	value: number;
};
type EventCall = (details: EventDetails) => void;
type EventMap = Map<ButtonName, EventCall[]>;

type ForReturnType = {
	before: ForChain;
	on: ForChain;
	after: ForChain;
};
type ForChain = (call: EventCall) => ForReturnType;
// 	before: (call: EventCall) => ForReturnType;
// 	on: (call: EventCall) => ForReturnType;
// 	after: (call: EventCall) => ForReturnType;
// };

export class MGamepad {
	readonly _gamepad: Gamepad;
	#state!: ButtonsState;
	#stickyState!: ButtonsState;

	readonly model: GamepadModel;
	get mapping() {
		return this.model.mapping;
	}

	#modeManager: ModeManager;

	axesThreshold: number;

	enabled = true;

	#events: {before: EventMap; on: EventMap; after: EventMap} = {
		before: new Map(),
		on: new Map(),
		after: new Map(),
	};

	constructor(gamepad: Gamepad, options?: MiniGamepadOptions) {
		this.axesThreshold = options?.axesThreshold ?? 0.5;
		this._gamepad = gamepad;
		this.model = getModelInformation(gamepad.id);
		// Initial state
		// TODO: give an option to choose between ignore initial state or not
		// this.#state = {
		// 	buttons: [...this._gamepad.buttons.map((b) => b.pressed)],
		// 	axes: [...this._gamepad.axes],
		// };
		this.resetButtons();

		this.#modeManager = new ModeManager(this.model);
	}

	getState() {
		return this.#state;
	}

	resetButtons() {
		this.#state = {
			buttons: Array.from({length: this._gamepad.buttons.length}, () => false),
			axes: Array.from({length: this._gamepad.axes.length}, () => 0),
		};
		this.#stickyState = {
			buttons: Array.from({length: this._gamepad.buttons.length}, () => false),
			axes: Array.from({length: this._gamepad.axes.length}, () => 0),
		};
	}

	#updateState() {
		const updatedGamepad = navigator.getGamepads()[this._gamepad.index];
		if (!updatedGamepad) {
			console.warn('Trying to detect changes from a ghost gamepad.');
			return this.#state;
		}
		// if (!updatedGamepad) {
		// 	throw new Error('Trying to detect changes from a ghost gamepad.');
		// }
		this.#state = {
			buttons: [...updatedGamepad.buttons.map((b) => b.pressed)],
			axes: [...updatedGamepad.axes],
		};
		return this.#state;
	}

	_detectChanges() {
		const prevState = {...this.#state};
		const newState = this.#updateState();
		const mode = this.#modeManager.update(newState);

		if (this.enabled === false) {
			return;
		}

		const details: EventDetails = {
			mode,
			value: NaN,
		};

		newState.buttons.forEach((pressed, i) => {
			const buttonName = i as ButtonName;

			if (
				pressed &&
				!prevState.buttons[i] &&
				this.#stickyState.buttons[i] === false
			) {
				this.#stickyState.buttons[i] = true;
				this.#events.before.get(buttonName)?.forEach((cb) => cb(details));
				switch (details.mode) {
					case Mode.NORMAL:
						cquerySelector(`[mgp="${buttonName}"]`)?.click();
						break;
					case Mode.PRIMARY:
						cquerySelector(`[mgp-primary="${buttonName}"]`)?.click();
						break;
					case Mode.SECONDARY:
						cquerySelector(`[mgp-secondary="${buttonName}"]`)?.click();
						break;
					case Mode.TERTIARY:
						cquerySelector(`[mgp-tertiary="${buttonName}"]`)?.click();
						break;
				}
			}
			if (pressed && this.#stickyState.buttons[i] === true) {
				this.#events.on.get(buttonName)?.forEach((cb) => cb(details));
			}
			if (
				!pressed &&
				prevState.buttons[i] &&
				this.#stickyState.buttons[i] === true
			) {
				this.#events.after.get(buttonName)?.forEach((cb) => cb(details));
				this.#stickyState.buttons[i] = false;
			}
		});

		for (let i = 0; i < newState.axes.length; ++i) {
			const level = newState.axes[i];
			const prevValue = prevState.axes[i];
			const threshold = this.axesThreshold;

			const isPositivePressed = level > threshold;
			const wasPositivePressed = prevValue > threshold;
			const isNegativePressed = level < -threshold;
			const wasNegativePressed = prevValue < -threshold;

			const posButton = `+axis${i}` as ButtonName;
			const negButton = `-axis${i}` as ButtonName;

			details.value = level;

			if (!wasPositivePressed && isPositivePressed) {
				this.#events.before.get(posButton)?.forEach((cb) => cb(details));
			} else if (isPositivePressed) {
				this.#events.on.get(posButton)?.forEach((cb) => cb(details));
			} else if (wasPositivePressed && !isPositivePressed) {
				this.#events.after.get(posButton)?.forEach((cb) => cb(details));
			}

			if (!wasNegativePressed && isNegativePressed) {
				this.#events.before.get(negButton)?.forEach((cb) => cb(details));
			} else if (isNegativePressed) {
				this.#events.on.get(negButton)?.forEach((cb) => cb(details));
			} else if (wasNegativePressed && !isNegativePressed) {
				this.#events.after.get(negButton)?.forEach((cb) => cb(details));
			}
		}
	}

	/**
	 * Registers an event that will execute when the button gets pressed
	 * before the 'on' event
	 */
	before(button: ButtonName, call: EventCall) {
		this.#registerEvent('before', button, call);
		return this;
	}

	on(button: ButtonName, call: EventCall) {
		this.#registerEvent('on', button, call);
		return this;
	}

	/**
	 * Executes when the button is released
	 */
	after(button: ButtonName, call: EventCall) {
		this.#registerEvent('after', button, call);
		return this;
	}

	for(...buttons: ButtonName[]): ForReturnType {
		return {
			before: (call: EventCall) => {
				buttons.forEach((button) => this.before(button, call));
				return this.for(...buttons);
			},
			on: (call: EventCall) => {
				buttons.forEach((button) => this.on(button, call));
				return this.for(...buttons);
			},
			after: (call: EventCall) => {
				buttons.forEach((button) => this.after(button, call));
				return this.for(...buttons);
			},
		};
	}

	#registerEvent(
		type: 'before' | 'on' | 'after',
		button: ButtonName,
		call: EventCall,
	) {
		if (!this.#events[type].has(button)) {
			this.#events[type].set(button, []);
		}
		this.#events[type].get(button)!.push(call);
	}

	getInfo() {
		return {
			enabled: this.enabled,
			state: this.#state,
			modes: this.#modeManager,
			model: this.model,
		};
	}
}
