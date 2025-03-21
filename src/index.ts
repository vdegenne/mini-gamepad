import {GamepadsManager} from './gamepadsManager.js';
import {HOOKS, type Hookable, type HookName} from './hooks.js';
import {type MGamepad} from './MGamepad.js';

export interface MiniGamepadOptions {
	axesThreshold: number;
	pollSleepMs: number;
}

export class HookController implements Hookable {
	#host: MiniGamepad;
	events: {
		connect: ((gamepad: MGamepad) => void)[];
		disconnect: ((gamepad: MGamepad) => void)[];
	} = {
		connect: [],
		disconnect: [],
	};
	constructor(host: MiniGamepad) {
		HOOKS.push(this);
		this.#host = host;
	}
	hooks(hookName: HookName, info: any): void {
		switch (hookName) {
			case 'connect':
				this.events.connect.forEach((call) => call(info));
				break;
			case 'disconnect':
				this.events.disconnect.forEach((call) => call(info));
				break;
		}
	}
}

export class MiniGamepad {
	#hookProxy = new HookController(this);
	#options: MiniGamepadOptions;
	constructor(options?: Partial<MiniGamepadOptions>) {
		this.#options = {
			axesThreshold: 0.4,
			pollSleepMs: 25,
			...(options ?? {}),
		};
		new GamepadsManager(this.#options);
	}

	onConnect(callback: (gamepad: MGamepad) => void) {
		this.#hookProxy.events.connect.push(callback);
	}
	onDisconnect(callback: (gamepad: MGamepad) => void) {
		this.#hookProxy.events.disconnect.push(callback);
	}

	#hooks(hookName: HookName, info: any) {}
}
