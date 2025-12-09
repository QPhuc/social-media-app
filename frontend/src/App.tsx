import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === "dark") {
			setDarkMode(true);
			document.documentElement.classList.add("dark");
		}
	}, []);

	const handleToggle = () => {
		if (darkMode) {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		} else {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		}
		setDarkMode(!darkMode);
	};
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Hello, Dark Mode!</h1>
			<button
				className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
				onClick={handleToggle}
				type="button"
			>
				Toggle Dark Mode
			</button>
		</div>
	);
}

export default App;
