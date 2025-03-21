# @vdegenne/mini-gamepad

Simple, Universal, extensible, easy-to-use ESM valley to gamify your browsing experience.

## How to use

```js
const minigp = new MiniGamepad({});

minigp.onConnect((gamepad) => {
	const {
		RIGHT_BUTTONS_TOP,
		RIGHT_BUTTONS_RIGHT,
		RIGHT_BUTTONS_BOTTOM,
		RIGHT_BUTTONS_LEFT,
	} = gamepad.mapping;

	gamepad.for(RIGHT_BUTTONS_TOP).before(() => {
		// ...
	});

	gamepad.for(RIGHT_BUTTONS_BOTTOM).on(() => {
		// ...
	});

	gamepad
		.for(RIGHT_BUTTONS_LEFT)
		.on(() => {
			// ...
		})
		.after(() => {
			// ...
		});
});
```
