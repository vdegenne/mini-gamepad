import {type ButtonName} from './buttons.js';
import {getMappingFromModel, UniversalMapping} from './mappings/index.js';

interface State {
	buttons: boolean[];
	axes: number[];
}

type EventMap = Map<ButtonName, (() => void)[]>;

export class MGamepad {
	readonly gamepad: Gamepad;
	#state!: State;
	readonly mapping: UniversalMapping;

	#events: {before: EventMap; on: EventMap; after: EventMap} = {
		before: new Map(),
		on: new Map(),
		after: new Map(),
	};

	constructor(gamepad: Gamepad) {
		this.gamepad = gamepad;
		this.mapping = getMappingFromModel(gamepad.id);
		// Initial state
		this.#state = {
			buttons: [...this.gamepad.buttons.map((b) => b.pressed)],
			axes: [...this.gamepad.axes],
		};
	}

	getState() {
		return this.#state;
	}

	detectChanges() {
		const prevState = {...this.#state};

		const updatedGamepad = navigator.getGamepads()[this.gamepad.index];
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
