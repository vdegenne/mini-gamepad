import {sleep} from './debug.js';
import {gamepadsManager} from './gamepadsManager.js';
import {type HookName, HOOKS} from './hooks.js';

let running = false;

async function poll() {
	if (!running) return;

	gamepadsManager.gamepads.forEach((gamepad, index) => {
		// console.log(index);
		if (process.env.NODE_ENV) {
			HOOKS.forEach((hook) =>
				hook.hooks(
					`gamepad${index}info` as HookName,
					gamepad ? JSON.stringify(gamepad?.getState(), null, 2) : undefined,
				),
			);
		}
		if (gamepad) {
			gamepad.detectChanges();
		}
	});

	if (process.env.NODE_ENV) {
		await sleep(1);
	}
	requestAnimationFrame(poll);
}

export function startPoll() {
	if (!running) {
		running = true;
		requestAnimationFrame(poll);
	}
}

export function stopPoll() {
	if (running) {
		running = false;
	}
}

export function togglePoll() {
	if (!running) {
		startPoll();
	} else {
		stopPoll();
	}
}
