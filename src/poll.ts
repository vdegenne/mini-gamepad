import {sleep} from './debug.js';
import {GamepadsManager} from './gamepadsManager.js';
import {type HookName, HOOKS} from './hooks.js';
import {MiniGamepadOptions} from './index.js';

const timer = new (class {
	#every = 1000;
	#i = 0;
	#startTime!: number;
	constructor() {
		this.reset();
	}
	reset() {
		this.#startTime = Date.now();
		this.#i = 0;
	}
	tick() {
		if (++this.#i >= this.#every) {
			console.log((Date.now() - this.#startTime) / 1000 + 's');
			this.reset();
		}
	}
})();

export class Poll {
	#running = false;

	constructor(
		private gamepadsManager: GamepadsManager,
		private options: MiniGamepadOptions,
	) {}

	async #poll() {
		if (!this.#running) return;

		for (let index = 0; index < this.gamepadsManager.gamepads.length; ++index) {
			timer.tick();
			const gamepad = this.gamepadsManager.gamepads[index];
			if (process.env.NODE_ENV === 'development') {
				HOOKS.forEach((hook) =>
					hook.hooks(
						`gamepad${index}info` as HookName,
						gamepad
							? JSON.stringify({state: gamepad?.getState()}, null, 2)
							: undefined,
					),
				);
			}
			if (gamepad) {
				await gamepad._detectChanges();
			}
		}

		await sleep(this.options.pollSleepMs);
		requestAnimationFrame(this.#poll.bind(this));
	}

	startPoll() {
		if (!this.#running) {
			this.#running = true;
			requestAnimationFrame(this.#poll.bind(this));
		}
	}
	stopPoll() {
		if (this.#running) {
			this.#running = false;
		}
	}
}
