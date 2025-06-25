"use client";

import {createContext, useContext, useEffect, useState} from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [userData, setUserDataState] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUserDataState(JSON.parse(storedUser));
        }
    }, [])

    const setUserData = (data) => {
        setUserDataState(data);
        localStorage.setItem("user", JSON.stringify(data));
    }

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);