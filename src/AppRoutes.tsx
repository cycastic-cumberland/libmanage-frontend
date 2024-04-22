import { Login } from "./components/Login.tsx";
import FourOFour from "./components/FourOFour.tsx";
import ClickJackingWarning from "./components/ClickJackingWarning.tsx";
import DashBoard from "./components/Dashboard.tsx";
import Management from "./components/Management.tsx";
// import ClickJackingWarning from "./components/ClickJackingWarning.tsx";

export type RouteInfo = { index?: boolean, isPrivate: boolean, path?: string, element: JSX.Element };

export const AppRoutes : RouteInfo[] = [
    {
        index: true,
        isPrivate: true,
        element: <DashBoard />,
    },
    {
        path: '/manage',
        isPrivate: true,
        element: <Management />
    },
    {
        path: '/login',
        isPrivate: false,
        element: <Login />
    },
    // For debugging purpose
    {
        path: '/clickjacking',
        isPrivate: false,
        element: <ClickJackingWarning />
    },
    {
        path: '*',
        isPrivate: false,
        element: <FourOFour />
    }
];
