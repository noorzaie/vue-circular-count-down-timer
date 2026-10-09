import { getCurrentInstance, getCurrentScope, onMounted, onScopeDispose } from 'vue';

interface TimerLifecycleOptions {
	autostart: () => boolean;
	start: () => void;
	/** Called when the page becomes visible again, to catch up with time spent in a background tab. */
	onVisible: () => void;
	stop: () => void;
}

/**
 * Starts the timer on mount (or right away outside of a component, never during SSR)
 * and stops it when the component or effect scope is disposed.
 */
export function useTimerLifecycle ({ autostart, start, onVisible, stop }: TimerLifecycleOptions): void {
	const hasDocument = typeof document !== 'undefined';
	const onVisibilityChange = () => {
		if (document.visibilityState === 'visible') {
			onVisible();
		}
	};

	const init = () => {
		if (hasDocument) {
			document.addEventListener('visibilitychange', onVisibilityChange);
		}
		if (autostart()) {
			start();
		}
	};

	if (getCurrentInstance()) {
		onMounted(init);
	} else if (hasDocument) {
		init();
	}

	if (getCurrentScope()) {
		onScopeDispose(() => {
			stop();
			if (hasDocument) {
				document.removeEventListener('visibilitychange', onVisibilityChange);
			}
		});
	}
}
