import {type ButtonName} from './buttons.js';
import {MiniGamepadOptions} from './index.js';
import {getMappingFromModel, UniversalMapping} from './mappings/index.js';

interface State {
	buttons: boolean[];
	axes: number[];
}

type EventMap = Map<ButtonName, (() => void)[]>;

export class MGamepad {
	readonly _gamepad: Gamepad;
	#state!: State;
	readonly mapping: UniversalMapping;

	axesThreshold: number;

	#events: {before: EventMap; on: EventMap; after: EventMap} = {
		before: new Map(),
		on: new Map(),
		after: new Map(),
	};

	constructor(gamepad: Gamepad, options?: MiniGamepadOptions) {
		this.axesThreshold = options?.axesThreshold ?? 0.5;
		this._gamepad = gamepad;
		this.mapping = getMappingFromModel(gamepad.id);
		// Initial state
		this.#state = {
			buttons: [...this._gamepad.buttons.map((b) => b.pressed)],
			axes: [...this._gamepad.axes],
		};
	}

	getState() {
		return this.#state;
	}

	async _detectChanges() {
		const prevState = {...this.#state};

		const updatedGamepad = navigator.getGamepads()[this._gamepad.index];
		if (!updatedGamepad) {
			throw new Error('Trying to detect changes from a ghost gamepad.');
		}
		this.#state = {
			buttons: [...updatedGamepad.buttons.map((b) => b.pressed)],
			axes: [...updatedGamepad.axes],
		};

		this.#state.buttons.forEach((pressed, i) => {
			const buttonName = `button${i}` as ButtonName;

			if (pressed && !prevState.buttons[i]) {
				this.#events.before.get(buttonName)?.forEach((callback) => callback());
			}
			if (pressed) {
				this.#events.on.get(buttonName)?.forEach((callback) => callback());
			}
			if (!pressed && prevState.buttons[i]) {
				this.#events.after.get(buttonName)?.forEach((callback) => callback());
			}
		});

		for (let i = 0; i < this.#state.axes.length; ++i) {
			const level = this.#state.axes[i];
			const prevValue = prevState.axes[i];
			const threshold = this.axesThreshold;

			const isPositivePressed = level > threshold;
			const wasPositivePressed = prevValue > threshold;
			const isNegativePressed = level < -threshold;
			const wasNegativePressed = prevValue < -threshold;

			const posButton = `+axis${i}` as ButtonName;
			const negButton = `-axis${i}` as ButtonName;

			if (!wasPositivePressed && isPositivePressed) {
				this.#events.before.get(posButton)?.forEach((cb) => cb());
			} else if (isPositivePressed) {
				this.#events.on.get(posButton)?.forEach((cb) => cb());
			} else if (wasPositivePressed && !isPositivePressed) {
				this.#events.after.get(posButton)?.forEach((cb) => cb());
			}

			if (!wasNegativePressed && isNegativePressed) {
				this.#events.before.get(negButton)?.forEach((cb) => cb());
			} else if (isNegativePressed) {
				this.#events.on.get(negButton)?.forEach((cb) => cb());
			} else if (wasNegativePressed && !isNegativePressed) {
				this.#events.after.get(negButton)?.forEach((cb) => cb());
			}
		}
	}

	/**
	 * Registers an event that will execute when the button gets pressed
	 * before the 'on' event
	 */
	before(button: ButtonName, call: VoidFunction) {
		this.#registerEvent('before', button, call);
		return this;
	}

	on(button: ButtonName, call: VoidFunction) {
		this.#registerEvent('on', button, call);
		return this;
	}

	/**
	 * Executes when the button is released
	 */
	after(button: ButtonName, call: VoidFunction) {
		this.#registerEvent('after', button, call);
		return this;
	}

	for(button: ButtonName) {
		return {
			before: (call: VoidFunction) => {
				this.before(button, call);
				return this.for(button);
			},
			on: (call: VoidFunction) => {
				this.on(button, call);
				return this.for(button);
			},
			after: (call: VoidFunction) => {
				this.after(button, call);
				return this.for(button);
			},
		};
	}

	#registerEvent(
		type: 'before' | 'on' | 'after',
		button: ButtonName,
		call: VoidFunction,
	) {
		if (!this.#events[type].has(button)) {
			this.#events[type].set(button, []);
		}
		this.#events[type].get(button)!.push(call);
	}
}
