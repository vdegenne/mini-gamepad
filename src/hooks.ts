export type HookName =
	| 'gamepad0info'
	| 'gamepad1info'
	| 'gamepad2info'
	| 'gamepad3info'
	/**
	 * When a gamepad got connected.
	 */
	| 'connect'
	/**
	 * When a gamepad got disconnected.
	 */
	| 'disconnect';

export interface Hookable {
	hooks(hookName: HookName, info: any): void;
}
export const HOOKS: Hookable[] = [];
export function registerHook(host: any) {
	HOOKS.push(host);
}
