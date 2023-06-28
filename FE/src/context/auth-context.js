import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    platform: null,
    login: () => {},
    logout: () => {},
    logoutNoMessage: () => {},
});