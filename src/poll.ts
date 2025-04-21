import {GamepadsManager} from './gamepadsManager.js';
import {type HookName, HOOKS} from './hooks.js';
import {type MiniGamepadOptions} from './options.js';
import {isDev, sleep} from './utils.js';

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
			if (isDev()) {
				console.log((Date.now() - this.#startTime) / 1000 + 's');
			}
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
			if (gamepad && (document.hasFocus() || this.options.backgroundActivity)) {
				gamepad._detectChanges();
			}
			if (isDev()) {
				HOOKS.forEach((hook) =>
					hook.hooks(
						`gamepad${index}info` as HookName,
						gamepad ? JSON.stringify(gamepad.getInfo(), null, 2) : undefined,
					),
				);
			}
		}

		await sleep(this.options.pollSleepMs);
		// requestAnimationFrame(this.#poll.bind(this));
		this.#poll();
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
