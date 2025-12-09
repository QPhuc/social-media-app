import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Home />} path="/" />
			</Routes>
		</BrowserRouter>
	);
}

export default AppRoutes;
