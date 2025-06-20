import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

interface AuthCtx { user: any | null; login: (t: string) => void; logout: () => void }
const AuthContext = createContext<AuthCtx>(null as never)

export function AuthProvider({ children }: React.PropsWithChildren<{}>) {
    const [user, setUser] = useState<any | null>(() => {
        const t = localStorage.getItem('jwt')
        return t ? jwtDecode(t) : null
    })

    // lê token ao iniciar
    useEffect(() => {
        const t = localStorage.getItem('jwt')
        if (t) setUser(jwtDecode(t))
    }, [])

    function login(token: string) {
        localStorage.setItem('jwt', token)
        setUser(jwtDecode(token))
    }
    function logout() {
        localStorage.removeItem('jwt')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
