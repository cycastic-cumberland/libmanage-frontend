import React from "react";
import { Navigate  } from "react-router-dom";
import {useLibmanageAuth} from "./LibmanageAuthProvider.tsx";
import {LibmanageAuthContextType} from "./LibmanageAuthContextType.ts";

const LOGIN_SUB_URL = "login";

const PrivateRoute: React.FC<{children: JSX.Element}> = ({ children }) => {
    const { isLoggedIn } = useLibmanageAuth() as LibmanageAuthContextType;
    return isLoggedIn() ? children : <Navigate to={`/${LOGIN_SUB_URL}`} />
}

export default PrivateRoute;
