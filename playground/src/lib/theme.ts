import { ref } from 'vue';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'cdt-theme';

const getInitialTheme = (): Theme => {
	const saved = document.documentElement.dataset.theme;
	if (saved === 'light' || saved === 'dark') {
		return saved;
	}
	return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const theme = ref<Theme>(getInitialTheme());

export function useTheme () {
	const toggleTheme = () => {
		theme.value = theme.value === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme.value;
		try {
			localStorage.setItem(STORAGE_KEY, theme.value);
		} catch {
			// Storage can be unavailable, e.g. in private windows; the theme still applies for this visit
		}
	};

	return { theme, toggleTheme };
}
