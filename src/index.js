import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';

import App from './App';
import Login from './components/account/login/Login'
import Register from './components/account/register/Register'
import Groups from './components/groups/Groups';
import Activities from './components/groups/activities/Activities';

import './index.css';
import 'primereact/resources/themes/mdc-dark-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        loader: () => !sessionStorage.getItem("bizu-auth") ? redirect("/account/login") : null,
        children: [
            {
                path: "grupos",
                element: <Groups />,
                children: [
                    { path: ":groupId/atividades", element: <Activities /> },
                ]
            }
        ]
    },
    {
        path: "/account",
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> }
        ]
    },
    {
        path: "*",
        element: (() => {
            return (
                <div className="error">
                    <span style={{fontSize: 40}}>404</span>
                </div>
            );
        })()
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <PrimeReactProvider>
        <RouterProvider router={router} />
    </PrimeReactProvider>
);

