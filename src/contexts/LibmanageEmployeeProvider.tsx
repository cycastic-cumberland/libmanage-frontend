import React, {useContext} from "react";
import {useLibmanageAuth} from "./LibmanageAuthProvider.tsx";

type LibmanageEmployeeContextType = {
    stuff: string
}

const LibmanageEmployeeContext = React.createContext<LibmanageEmployeeContextType>(null as any)

export const useLibmanageEmployee = () => useContext(LibmanageEmployeeContext)


const LibmanageEmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {userSession} = useLibmanageAuth()

    const value: LibmanageEmployeeContextType = {

    }

    return <LibmanageEmployeeContext.Provider value={value}>
        { children }
    </LibmanageEmployeeContext.Provider>
}
