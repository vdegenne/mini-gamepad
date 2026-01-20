interface RepeaterOptions {
	action: () => void | Promise<void>;

	/**
	 * Time after which the action gets repeated.
	 * @default 300
	 */
	repeatTimeoutMs?: number;

	/**
	 * The speed at which the action is repeated.
	 * @default 100
	 */
	speedMs?: number;
}

export class Repeater {
	#options: RepeaterOptions;
	#timeoutId?: number;
	#running = false;

	constructor(options: RepeaterOptions) {
		this.#options = {
			repeatTimeoutMs: 300,
			speedMs: 100,
			...options,
		};
	}

	async #loop() {
		while (this.#running) {
			await this.#options.action();
			await new Promise((resolve) => {
				this.#timeoutId = setTimeout(resolve, this.#options.speedMs);
			});
		}
	}

	start() {
		this.stop(); // stop previous loop if any
		this.#running = true;

		// run immediately
		this.#options.action();

		// start repeated loop after repeatTimeoutMs
		this.#timeoutId = setTimeout(() => {
			if (this.#running) this.#loop();
		}, this.#options.repeatTimeoutMs);
	}

	stop() {
		this.#running = false;
		if (this.#timeoutId) {
			clearTimeout(this.#timeoutId);
			this.#timeoutId = undefined;
		}
	}
}
