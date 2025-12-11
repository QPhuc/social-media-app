import { createContext, useContext, useState } from "react"

type User = { id: string; name: string }

type AuthContextType = {
	user: User | null
	login: (userData: User) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)

	const login = (userData: User) => setUser(userData)
	const logout = () => setUser(null)

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
