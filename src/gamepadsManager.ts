// import {Debouncer} from '@vdegenne/debouncer';
import {type Logger} from '@vdegenne/debug';
import {MGamepad} from './MGamepad.js';
import Debouncer from './debouncer.js';
import {HOOKS} from './hooks.js';
import {type MiniGamepadOptions} from './options.js';
import {Poll} from './poll.js';

export class GamepadsManager {
	readonly gamepads: (MGamepad | null)[] = [null, null, null, null];
	// TODO: private
	// gamepadEnableStates: boolean[] = [];

	#options: MiniGamepadOptions;

	// TODO: private
	connectionChangedDebouncer: Debouncer;
	// TODO: private
	poll: Poll;

	constructor(options: MiniGamepadOptions) {
		this.#options = options;
		this.connectionChangedDebouncer = new Debouncer(
			this.#onConnectionChanged,
			10,
		);

		window.addEventListener('gamepadconnected', () =>
			this.connectionChangedDebouncer.call(),
		);
		window.addEventListener('gamepaddisconnected', () =>
			this.connectionChangedDebouncer.call(),
		);

		this.poll = new Poll(this, options);

		window.addEventListener('blur', () => {
			return;
			if (options.backgroundActivity === false) {
				this.disableAll();
			}
		});
		window.addEventListener('focus', () => {
			return;
			if (options.backgroundActivity === false) {
				setTimeout(() => {
					this.gamepads.forEach((gamepad) => gamepad && gamepad.resetButtons()); // For sticky buttons
					this.reenableAll();
				}, options.focusDeadTimeMs);
			}
		});
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
		if (this.#options.debug) {
			const logFn =
				this.#options.logger?.log.bind(this.#options.logger) ?? console.log;
			logFn(`${gamepad.id} just got connected.`);
		}
		// if (this.options.toastModel) {
		// import('toastit').then(({default: toast}) => {
		// 	toast(`${gamepad.id} just got connected.`, {
		// 		leading: true,
		// 		timeoutMs: 1000,
		// 	});
		// });
		// }
		this.gamepads[index] = new MGamepad(gamepad, this.#options);
		HOOKS.forEach((hook) => hook.hooks('connect', this.gamepads[index]));
		this.poll.startPoll();
	}

	#onDisconnect(index: number) {
		const mgamepad = this.gamepads[index];
		if (!mgamepad || mgamepad._gamepad.index !== index) {
			throw new Error('Something not quite right here.');
		}
		if (this.#options.debug) {
			const logFn =
				this.#options.logger?.log.bind(this.#options.logger) ?? console.log;
			logFn(`${mgamepad._gamepad.id} just got disconnected.`);
		}
		HOOKS.forEach((hook) => hook.hooks('disconnect', this.gamepads[index]));
		this.gamepads[index] = null;
	}

	disableAll() {
		// this.gamepadEnableStates = this.gamepads.map((g) => g?.enabled ?? false);
		this.gamepads.forEach((g) => g && (g.enabled = false));
	}
	reenableAll() {
		// this.gamepads.forEach(
		// 	(g, i) => g && (g.enabled = this.gamepadEnableStates[i]),
		// );
		this.gamepads.forEach((g) => g && (g.enabled = true));
	}
}

// export const gamepadsManager = new GamepadsManager();
