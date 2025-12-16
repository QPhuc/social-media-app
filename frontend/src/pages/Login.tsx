import { type FormEvent, useState } from "react"
import api from "@/lib/axios"

export default function Login() {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			const _res = await api.get("/WeatherForecast")
			// setAccessToken(res.data.accessToken)
			// alert("Login success!",res)
		} catch (_err) {
			alert("Login failed!")
		}
	}

	return (
		<form onSubmit={handleLogin}>
			<input
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
				value={username}
			/>
			<input
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				type="password"
				value={password}
			/>
			<button type="submit">Login</button>
		</form>
	)
}
