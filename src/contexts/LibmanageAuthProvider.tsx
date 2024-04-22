import React, {useContext, useRef, useState} from "react";
import axios from "axios";
import {LibmanageAuthContextType, LibmanageUserSession} from "./LibmanageAuthContextType.ts";
import Cookies from 'js-cookie';
import {EmployeeCreationPayload} from "./LibmanageAuthContextType.ts";
import {useLibmanageLog} from "./LibmanageLogProvider.tsx";
import Translations from "../I18N.ts";

const LibmanageAuthContext = React.createContext<LibmanageAuthContextType>(null as any);

const AUTH_URL = process.env.REACT_APP_LIBMANAGE_BASE_URL as string + "api/v1/";
const AUTH_COOKIE_NAME = "cumailSession";
const SIGNUP_SUB_URL = 'employees';
const LOGIN_SUB_URL = "auth";

const authPOST = (subUrl: string, pack: any, authorization?: string) => {
    return axios.post(AUTH_URL + subUrl, pack, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authorization ? `Bearer ${authorization}` : ''
        }
    })
}


// eslint-disable-next-line react-refresh/only-export-components
export const useLibmanageAuth = () => {
    return useContext(LibmanageAuthContext)
}

export const LibmanageAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {addError, addSuccess, addInfo} = useLibmanageLog()
    const userSession = useRef<LibmanageUserSession>({
        idToken: "",
        role: "",
        id: "",
        fullName: "",
    })
    const [isLoading, setLoading] = useState(false);


    function loadUserSessionFromCookie(){
        const sessionCookieRaw: string | undefined = Cookies.get(AUTH_COOKIE_NAME);
        if (sessionCookieRaw){
            const sessionCookie: LibmanageUserSession = JSON.parse(sessionCookieRaw);
            if (Object.keys(sessionCookie).length === 0) return false;
            // console.log("Loaded:", sessionCookie);
            changeUserNonVolatile(sessionCookie);
            return true;
        }
        return false;
    }

    function changeUserNonVolatile(session: LibmanageUserSession){
        // setCurrentUser((_oldSession) => session);
        userSession.current = session;
    }
    function getSession() {
        return userSession.current;
    }

    function changeUser(session: LibmanageUserSession){
        if (session.idToken === "" || session.id === ""){
            console.log("Removing auth session cookie...")
            Cookies.remove(AUTH_COOKIE_NAME);
        } else {
            console.log("Saving auth session cookie...")
            Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(session), {
                path: '/',
                secure: true,
                sameSite: 'Strict'
            })
        }
        changeUserNonVolatile(session);
    }

    async function createEmployeeAccount(payload: EmployeeCreationPayload){
        if (isLoading) return;
        setLoading(true)
        addInfo("Creating...")
        try {
            const response = await authPOST(SIGNUP_SUB_URL, payload)
            if (response.status > 299) addError(Translations.employeeAccountCreationFailed)
            else {
                addSuccess(Translations.employeeAccountCreated)
            }
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        setLoading(false)
    }
    async function loginWithEmailPassword(id: string, password: string){
        if (isLoading) return;
        setLoading(true)
        addInfo(Translations.employeeAuthenticating)
        try {
            const response = await authPOST(LOGIN_SUB_URL, { id, password })
            if (response.status > 299) addError(Translations.employeeLogInFailed)
            else {
                changeUser(response.data)
                addSuccess(Translations.employeeLoggedIn)
            }
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        setLoading(false)
    }
    function logout() {
        changeUser({
            idToken: "",
            role: "",
            fullName: "",
            id: ""
        })
        addSuccess(Translations.employeeLoggedOut)
        // navigate("/")
    }

    function isLoggedIn() {
        loadUserSessionFromCookie();
        return getSession().idToken !== "" && getSession().id !== "";
    }

    const value: LibmanageAuthContextType = {
        userSession: userSession,
        isLoading: isLoading,
        createEmployeeAccount: createEmployeeAccount,
        loginWithEmailPassword: loginWithEmailPassword,
        logout: logout,
        isLoggedIn: isLoggedIn,
        getSession: getSession,
    }
    return (<LibmanageAuthContext.Provider value={value}>
        {/*{ !isLoading && children }*/}
        { children }
    </LibmanageAuthContext.Provider>)
}
