import '@material/web/all.js';
import {state, withController} from '@snar/lit';
import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {materialShellLoadingOff} from 'material-shell';
import {liveInfo} from '../src/debug.js';
import '../src/index.ts';
import {startPoll} from '../src/poll.js';
import {MiniGamepad} from '../src/index.js';

// Bypass startPoll on first connect
startPoll();

@customElement('app-shell')
@withController(liveInfo)
export class AppShell extends LitElement {
	@state() button1Pushed = false;
	@state() button2Pushed = false;
	@state() button3Pushed = false;
	@state() button4Pushed = false;

	setFeedback(input: any) {
		this.renderRoot.querySelector<HTMLInputElement>('#feedback')!.value =
			JSON.stringify(input);
	}

	protected firstUpdated() {
		materialShellLoadingOff.call(this);

		const minigp = new MiniGamepad({});
		minigp.onConnect((gamepad) => {
			gamepad
				.before('button0', () => (this.button1Pushed = true))
				.after('button0', () => (this.button1Pushed = false));
			gamepad
				.before('button1', () => (this.button2Pushed = true))
				.after('button1', () => (this.button2Pushed = false));
			gamepad
				.before('button2', () => (this.button3Pushed = true))
				.after('button2', () => (this.button3Pushed = false));
			gamepad
				.before('button3', () => (this.button4Pushed = true))
				.after('button3', () => (this.button4Pushed = false));
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
					<div>button 1 pressed : ${this.button1Pushed}</div>
					<div>button 2 pressed : ${this.button2Pushed}</div>
					<div>button 3 pressed : ${this.button3Pushed}</div>
					<div>button 4 pressed : ${this.button4Pushed}</div>
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
