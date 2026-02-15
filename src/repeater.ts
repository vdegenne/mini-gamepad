interface RepeaterOptions<TArgs extends unknown[]> {
	action: (...args: TArgs) => void | Promise<void>;

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

export class Repeater<TArgs extends unknown[]> {
	#options: Required<Omit<RepeaterOptions<TArgs>, 'action'>> & {
		action: RepeaterOptions<TArgs>['action'];
	};
	#timeoutId?: number;
	#running = false;
	#args?: TArgs;

	constructor(options: RepeaterOptions<TArgs>) {
		this.#options = {
			repeatTimeoutMs: 300,
			speedMs: 100,
			...options,
		};
	}

	async #loop() {
		while (this.#running) {
			await this.#options.action(...this.#args!);
			await new Promise((resolve) => {
				this.#timeoutId = setTimeout(resolve, this.#options.speedMs);
			});
		}
	}

	start(...args: TArgs) {
		this.stop();
		this.#running = true;
		this.#args = args;

		// immediate run
		this.#options.action(...args);

		// delayed repeat
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
