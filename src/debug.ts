import {ReactiveController, state} from '@snar/lit';
import {type Hookable, type HookName, registerHook} from './hooks.js';

class LiveInfo extends ReactiveController implements Hookable {
	@state() gamepad0info = '';
	@state() gamepad1info = '';
	@state() gamepad2info = '';
	@state() gamepad3info = '';

	constructor() {
		super();
	}
	protected firstUpdated() {
		registerHook(this);
	}

	hooks(hookName: HookName, info: any) {
		this[hookName as keyof this] = info;
	}
}

export const liveInfo = new LiveInfo();
