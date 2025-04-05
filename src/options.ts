export interface MiniGamepadOptions {
	/**
	 * @default 0.4
	 */
	axesThreshold: number;

	/** @default 16 */
	pollSleepMs: number;

	/**
	 * Set to true if you want the controller keep responding to presses
	 * even when the page has lost focus.
	 *
	 * @default false
	 */
	backgroundActivity: boolean;

	/**
	 * When the page regains focus how much time to wait before controllers
	 * responds to presses again. Useful if you control other pages with a controller
	 * too and want to avoid unwanted triggers when the page focuses back.
	 *
	 * This option is ignored if `backgroundActivity` is set to true.
	 *
	 * @default 100
	 */
	focusDeadTimeMs: number;

	/**
	 * TODO: to implement
	 */
	sticky: boolean;
}

export const DEFAULT_OPTIONS: MiniGamepadOptions = {
	axesThreshold: 0.4,
	pollSleepMs: 16,
	backgroundActivity: false,
	focusDeadTimeMs: 100,
	sticky: true,
};
