# Changelog

All notable changes to this project are documented in this file.
This project follows [Semantic Versioning](https://semver.org/).

## 3.0.0

Version 3 is a rewrite for Vue 3 in TypeScript. The props, circle options and events of `CircularCountDownTimer` are kept, so most apps only need to change how the plugin is registered. See [Migrating from version 2](README.md#migrating-from-version-2).

### Breaking changes

- Requires Vue 3.5 or later. Register the plugin with `app.use()` instead of `Vue.use()`. Vue 2 users can keep using version 2.
- The bundle files in `dist` were renamed, and the package now has an `exports` map. Import from the package root instead of from `dist` files.
- `startValue` now means a circle holds `steps` values from `startValue` to `startValue + steps - 1`. Before, a circle counting up with `startValue: 1` and `steps: 12` skipped 12, and negative start values had more than `steps` values.
- The default colors and font sizes now come from CSS custom properties (`--cdt-stroke-color`, ...). The look is unchanged unless you set these variables.
- A circle option set to `undefined` now falls back to the shared option of the component.
- After the browser throttles timers (for example in a background tab), the timer catches up in a single `update` event instead of a burst of events.

### Added

- `CircularTimeCountDown` component: counts down to an `end` date or for a `duration`, in days, hours, minutes and seconds.
- `useCountdown` composable and `splitTime` helper to build your own countdown UI, and the `CountDownCircle` component as a named export.
- `start()`, `pause()`, `resume()` and `reset()` methods through template refs, the `autostart` prop and the `started`, `paused` and `reset` events.
- `value` and `label` slots.
- `formatValue`, `strokeLinecap` and `direction` options.
- Theming with CSS custom properties.
- `role="timer"` and an automatic `aria-label`, overridable with the `ariaLabel` prop.
- TypeScript types for all components, props, events, slots and options.
- Interactive playground and examples at https://noorzaie.github.io/vue-circular-count-down-timer/.

### Fixed

- The timer is stopped when the component is unmounted.
- Timers are based on the clock, so they no longer drift.
- Circles with `size: 0` now resize with their container.
- Cyclic `dependentCircles` can no longer freeze the page.
- The README documented the `finished` event as `finish`.

### Changed

- Smaller bundle: about 5 kB gzipped, with styles included.
- Built with Vite; tested with Vitest.

## 2.0.0 and earlier

See the [git history](https://github.com/noorzaie/vue-circular-count-down-timer/commits/master).
