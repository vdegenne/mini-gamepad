interface RepeaterOptions<TArgs extends unknown[]> {
	action: (...args: TArgs) => void | Promise<void>;

	/**
	 * Time after which the action gets repeated.
	 *
	 * @default 300
	 */
	initialDelayMs?: number;

	/**
	 * The speed at which the action is repeated.
	 *
	 * @default 100
	 */
	intervalMs?: number;
}

export class Repeater<TArgs extends unknown[]> {
	// TODO: revert if it fails
	// public readonly options: Required<Omit<RepeaterOptions<TArgs>, 'action'>> & {
	// 	action: RepeaterOptions<TArgs>['action'];
	// };
	public readonly options: Required<RepeaterOptions<TArgs>>;
	#timeoutId?: number;
	#running = false;
	#args?: TArgs;

	constructor(options: RepeaterOptions<TArgs>) {
		this.options = {
			initialDelayMs: 300,
			intervalMs: 100,
			...options,
		};
	}

	async #loop() {
		while (this.#running) {
			await this.options.action(...this.#args!);
			await new Promise((resolve) => {
				this.#timeoutId = setTimeout(resolve, this.options.intervalMs);
			});
		}
	}

	async start(...args: TArgs) {
		this.stop();
		this.#running = true;
		this.#args = args;

		// immediate run
		await this.options.action(...args);

		// delayed repeat
		this.#timeoutId = setTimeout(() => {
			if (this.#running) this.#loop();
		}, this.options.initialDelayMs);
	}

	stop() {
		this.#running = false;
		if (this.#timeoutId) {
			clearTimeout(this.#timeoutId);
			this.#timeoutId = undefined;
		}
	}
}
