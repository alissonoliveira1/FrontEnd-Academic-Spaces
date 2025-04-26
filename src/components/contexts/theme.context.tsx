import {
	type PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

type Theme = "light" | "dark" | "system";

export interface ThemeContext {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const themeContext = createContext<ThemeContext>({} as ThemeContext);

export type ThemeProvider = PropsWithChildren<{
	defaultTheme: Theme;
}>;

export function ThemeProvider({ defaultTheme, children }: ThemeProvider) {
	const [theme, setTheme] = useState<Theme>(defaultTheme);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";

			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	return (
		<themeContext.Provider value={{ setTheme, theme }}>
			{children}
		</themeContext.Provider>
	);
}

export function useTheme() {
	return useContext(themeContext);
}
