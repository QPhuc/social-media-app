import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext<any>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [darkMode, setDarkMode] = useState(false)

	useEffect(() => {
		const saved = localStorage.getItem("theme") === "dark"
		setDarkMode(saved)
		document.documentElement.classList.toggle("dark", saved)
	}, [])

	const toggleTheme = () => {
		const next = !darkMode
		setDarkMode(next)
		document.documentElement.classList.toggle("dark", next)
		localStorage.setItem("theme", next ? "dark" : "light")
	}

	return (
		<ThemeContext.Provider value={{ darkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = () => useContext(ThemeContext)
