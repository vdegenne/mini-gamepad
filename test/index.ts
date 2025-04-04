import '@material/web/all.js';
import {state, withController} from '@snar/lit';
import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {materialShellLoadingOff} from 'material-shell';
import {liveInfo} from '../src/debug.js';
import '../src/index.ts';
import {MiniGamepad} from '../src/index.js';

@customElement('app-shell')
@withController(liveInfo)
export class AppShell extends LitElement {
	@state() leftButtonsTop = false;
	@state() leftButtonsBottom = false;
	@state() leftButtonsLeft = false;
	@state() leftButtonsRight = false;

	setFeedback(input: any) {
		this.renderRoot.querySelector<HTMLInputElement>('#feedback')!.value =
			JSON.stringify(input);
	}

	protected firstUpdated() {
		materialShellLoadingOff.call(this);

		const minigp = new MiniGamepad({pollSleepMs: 0, axesThreshold: 0.5});
		minigp.onConnect((gamepad) => {
			const {
				LEFT_BUTTONS_TOP,
				LEFT_BUTTONS_RIGHT,
				LEFT_BUTTONS_BOTTOM,
				LEFT_BUTTONS_LEFT,
				LEFT_STICK_UP,
				LEFT_STICK_DOWN,
			} = gamepad.mapping;

			gamepad
				.for(LEFT_BUTTONS_TOP)
				.on(() => {
					console.log('up before');
				})
				.after(() => {
					console.log('up after');
				});
			gamepad
				.for(LEFT_BUTTONS_BOTTOM)
				.before(() => {
					console.log('down before');
				})
				.after(() => {
					console.log('down after');
				});

			gamepad
				.for(LEFT_BUTTONS_TOP)
				.before(() => (this.leftButtonsTop = true))
				.after(() => (this.leftButtonsTop = false));
			gamepad
				.for(LEFT_BUTTONS_BOTTOM)
				.before(() => (this.leftButtonsBottom = true))
				.after(() => (this.leftButtonsBottom = false));

			gamepad
				.for(LEFT_BUTTONS_LEFT)
				.before(() => (this.leftButtonsLeft = true))
				.after(() => (this.leftButtonsLeft = false));

			gamepad
				.for(LEFT_BUTTONS_RIGHT)
				.before(() => (this.leftButtonsRight = true))
				.after(() => (this.leftButtonsRight = false));
		});
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	render() {
		return html`
			<div id="gamepads" style="display:flex">
				<div>
					gamepad1
					<pre>${liveInfo.gamepad0info || 'not connected'}</pre>
					<div>left buttons up pressed : ${this.leftButtonsTop}</div>
					<div>left buttons down pressed : ${this.leftButtonsBottom}</div>
					<div>left buttons left pressed : ${this.leftButtonsLeft}</div>
					<div>left buttons rigth pressed : ${this.leftButtonsRight}</div>
				</div>
				<div>
					gamepad2
					<pre>${liveInfo.gamepad1info || 'not connected'}</pre>
				</div>
				<div>
					gamepad3
					<pre>${liveInfo.gamepad2info || 'not connected'}</pre>
				</div>
				<div>
					gamepad4
					<pre>${liveInfo.gamepad3info || 'not connected'}</pre>
				</div>
				<!-- 
				<md-text-button
					@click=${() => {
					//		inspect(window.navigator.getGamepads().filter((gp) => gp));
				}}
					>what</md-text-button
				>
				-->

				<br />
			</div>
		`;
	}
}

document.body.querySelector('material-shell')?.appendChild(new AppShell());
