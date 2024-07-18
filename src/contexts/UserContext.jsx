import React, { useContext, useState } from "react";

export const UserContext = React.createContext();

export function UserProvider({ children })
{
    const [user, setUser] = useState({
        id: undefined,
        name: "",
        avatar: ""
    });

    return (
        <UserContext.Provider value={{
            user: user,
            setUser: setUser
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser()
{
    return useContext(UserContext);
}

