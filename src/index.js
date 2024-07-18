import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { ModalProvider } from './contexts/ModalContext';

import App from './App';
import Login from './components/account/components/login/Login'
import Register from './components/account/components/register/Register'
import Groups from './components/groups/Groups';
import Activities from './components/groups/components/activities/Activities';

import 'primereact/resources/themes/mdc-dark-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './index.css';

const router = createBrowserRouter([
    {
        path: "/*",
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
        element: (
            <div className="error">
                <span style={{fontSize: 40}}>404</span>
            </div>
        )
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <PrimeReactProvider>
        <ModalProvider>
            <RouterProvider router={router} />
        </ModalProvider>
    </PrimeReactProvider>
);

