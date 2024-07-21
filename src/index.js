import Activities from "./components/groups/components/activities/Activities";
import App from "./App";
import AuthProvider from "./contexts/UserContext";
import Groups from "./components/groups/Groups";
import Invite from "./components/groups/components/invite/Invite";
import Login from "./components/account/components/login/Login"
import { ModalProvider } from "./contexts/ModalContext";
import { PrimeReactProvider } from "primereact/api";
import ReactDOM from "react-dom/client";
import React from "react";
import Register from "./components/account/components/register/Register"
import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";

import "./index.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/mdc-dark-indigo/theme.css";

const router = createBrowserRouter([
    {
        path: "/*",
        element: <App />,
        loader: () => !sessionStorage.getItem("user") ? redirect("/account/login") : null,
        children: [
            {
                path: "grupos",
                element: <Groups />,
                children: [
                    { path: "convite", element: <Invite /> },
                    { path: ":groupId/atividades", element: <Activities /> }
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

ReactDOM.createRoot(document.getElementById("root")).render(
    <PrimeReactProvider>
        <ModalProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ModalProvider>
    </PrimeReactProvider>
);

