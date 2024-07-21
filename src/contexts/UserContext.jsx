import React, { useContext, useEffect, useMemo, useState } from "react";
import { UserService } from "../components/account/services/UserService";

export const AuthContext = React.createContext();

const FIXME_avatar = "https://i.pinimg.com/236x/7f/e3/b9/7fe3b9cc49d2c141179b7f2ffd553088.jpg";

export default function AuthProvider({ children })
{
    const userService = useMemo(() => new UserService(), []);

    const [user, setUser] = useState({
        id: null,
        name: null,
        auth: null,
        avatar: null
    });

    const login = (user) => {
        sessionStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        sessionStorage.clear();
    };

    useEffect(() => {
        if (sessionStorage.getItem("user"))
            userService.self().then((result) => {
                login({
                    id: result.id,
                    name: result.name,
                    auth: result.auth,
                    avatar: FIXME_avatar
                });
            });
    }, []);

    return (
        <AuthContext.Provider value={{
            user: user,
            login: login,
            logout: logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth()
{
    return useContext(AuthContext);
}

