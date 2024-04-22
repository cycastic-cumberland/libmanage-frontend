import './App.css';
import { AppRoutes } from './AppRoutes';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import PrivateRoute from "./contexts/PrivateRoute.tsx";
import {LibmanageLogProvider, SnackbarWrapper} from "./contexts/LibmanageLogProvider.tsx";
import {LibmanageAuthProvider} from "./contexts/LibmanageAuthProvider.tsx";
import {LibmanageFunctionsProvider} from "./contexts/LibmanageFunctionsProvider.tsx";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export default function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <LibmanageLogProvider>
                <LibmanageAuthProvider>
                    <LibmanageFunctionsProvider>
                        <Router>
                            <Routes>
                                { AppRoutes.map((route, index) => {
                                    const { element, isPrivate, ...rest } = route;
                                    return isPrivate ?
                                        <Route key={index} {...rest} element={<PrivateRoute><SnackbarWrapper>{element}</SnackbarWrapper></PrivateRoute>}/>
                                        : <Route key={index} {...rest} element={<SnackbarWrapper>{element}</SnackbarWrapper>}/>;
                                }) }
                            </Routes>
                        </Router>
                    </LibmanageFunctionsProvider>
                </LibmanageAuthProvider>
            </LibmanageLogProvider>
        </ThemeProvider>
    )
}