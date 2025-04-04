// import {Debouncer} from '@vdegenne/debouncer';
import {MGamepad} from './MGamepad.js';
import Debouncer from './debouncer.js';
import {HOOKS} from './hooks.js';
import {MiniGamepadOptions} from './index.js';
import {Poll} from './poll.js';

export class GamepadsManager {
	readonly gamepads: (MGamepad | null)[] = [null, null, null, null];

	#options: MiniGamepadOptions;

	#connectionChangedDebouncer: Debouncer;
	#poll: Poll;

	constructor(options: MiniGamepadOptions) {
		this.#options = options;
		this.#connectionChangedDebouncer = new Debouncer(
			this.#onConnectionChanged,
			10,
		);

		window.addEventListener('gamepadconnected', () =>
			this.#connectionChangedDebouncer.call(),
		);
		window.addEventListener('gamepaddisconnected', () =>
			this.#connectionChangedDebouncer.call(),
		);

		this.#poll = new Poll(this, options);
	}

	#onConnectionChanged = () => {
		for (let index = 0; index < this.gamepads.length; index++) {
			const gamepad = navigator.getGamepads()?.[index];
			if (gamepad !== null && this.gamepads[index] === null) {
				this.#onConnect(gamepad, index);
			} else if (gamepad === null && this.gamepads[index] !== null) {
				this.#onDisconnect(index);
			}
		}
	};

	#onConnect(gamepad: Gamepad, index: number) {
		if (gamepad.index !== index) {
			throw new Error('Something not quite right here.');
		}
		console.log(`${gamepad.id} just got connected.`);
		this.gamepads[index] = new MGamepad(gamepad, this.#options);
		HOOKS.forEach((hook) => hook.hooks('connect', this.gamepads[index]));
		this.#poll.startPoll();
	}

	#onDisconnect(index: number) {
		const mgamepad = this.gamepads[index];
		if (!mgamepad || mgamepad._gamepad.index !== index) {
			throw new Error('Something not quite right here.');
		}
		console.log(`${mgamepad._gamepad.id} got disconnected.`);
		HOOKS.forEach((hook) => hook.hooks('disconnect', this.gamepads[index]));
		this.gamepads[index] = null;
	}
}

// export const gamepadsManager = new GamepadsManager();
