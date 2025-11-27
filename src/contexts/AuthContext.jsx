import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const currentToken = localStorage.getItem("token");
            if (currentToken) {
                const decodedToken = jwtDecode(currentToken);
                // Check if token is expired
                if (decodedToken.exp * 1000 < Date.now()) {
                    throw new Error("Token expired");
                }
                setUser({
                    username: decodedToken.sub,
                    role: decodedToken.role || 'ROLE_USER'
                });
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Token validation failed:", error.message);
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const value = { user, token, login, logout, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};