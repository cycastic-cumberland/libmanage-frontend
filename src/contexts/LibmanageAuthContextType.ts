import React from "react";

export type LibmanageUserSession = { idToken: string, id: string, fullName: string, role: string };

export type EmployeeCreationPayload = {
    id: string,
    fullName: string,
    password: string,
    role: string
}

export type LibmanageAuthContextType = {
    userSession: React.MutableRefObject<LibmanageUserSession>,
    isLoading: boolean,
    createEmployeeAccount: (payload: EmployeeCreationPayload) => Promise<void>,
    loginWithEmailPassword: (username: string, password: string) => Promise<void>,
    logout: () => void,
    isLoggedIn: () => boolean,
    getSession: () => LibmanageUserSession
}
