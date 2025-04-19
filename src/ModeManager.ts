import {ButtonsState} from './MGamepad.js';
import {GamepadModel, Modes, type UniversalMapping} from './models/index.js';

export enum Mode {
	NORMAL = 0,
	PRIMARY = 1,
	SECONDARY = 2,
	TERTIARY = 3,
}

const RELEASED = 'R';
const PRESSED = 'P';

export class ModeManager {
	#modesButtons!: number[];
	#modes: (string | null)[] = [];

	#mode: Mode = Mode.NORMAL;

	constructor(private model: GamepadModel) {
		if (this.model.modes) {
			const buttonToId = (name: string) => {
				return this.model.mapping[name as keyof UniversalMapping] as number;
			};
			this.#modesButtons = (
				[...new Set<string>(Object.values(this.model.modes).flat())].map(
					(buttonName) => buttonToId(buttonName),
				) as number[]
			).sort();

			this.#modes = Array.from(
				{length: Object.keys(this.model.modes).length + 1},
				() => null,
			);

			this.#modes[0] = RELEASED.repeat(this.#modesButtons.length);

			Object.entries(this.model.modes).forEach(([mode, buttons]) => {
				const toIds = buttons
					.map((buttonName) => buttonToId(buttonName))
					.sort();
				const strRepresentation = this.#modesButtons
					.map((id) => (toIds.includes(id) ? PRESSED : RELEASED))
					.join('');

				let modeIndex: 1 | 2 | 3;
				switch (mode as keyof Modes) {
					case 'primary':
						modeIndex = 1;
						break;
					case 'secondary':
						modeIndex = 2;
						break;
					case 'tertiary':
						modeIndex = 3;
						break;
				}
				this.#modes[modeIndex] = strRepresentation;
			});
		}
	}

	update(state: ButtonsState): Mode {
		const strRepresentation = this.#modesButtons
			.map((id) => (state.buttons[id] ? PRESSED : RELEASED))
			.join('');
		return (this.#mode = this.#modes.findIndex(
			(config) => config === strRepresentation,
		));
	}

	toJSON() {
		return {
			buttons: this.#modesButtons,
			modes: this.#modes,
			mode: this.#mode,
		};
	}
}
