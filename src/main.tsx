import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {createRoot} from "react-dom/client";
import axios from "axios";
import { initializeApp } from "firebase/app";
import RequireAuth from './services/requireAuth.component.tsx';
import LoginView from './views/Login/login.view.tsx';
import PanelView from './views/Panel/Panel.view.tsx';
import { login } from './services/login.service.tsx';
import RegisterView from "./views/Register/register.view.tsx";
import RegistrationView from "./views/Registration/registration.view.tsx";

initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_API_ID,
});

axios.defaults.baseURL = import.meta.env.VITE_AXIOS_URL || "";

axios.interceptors.response.use(
  (response: any) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.request && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user: any = JSON.parse(localStorage.getItem("user") || "{}");
        const response: any = await login({ uid: user.uid, email: user.email });

        if (response instanceof Error && response.message !== "OK") {
          console.error("Error getting content", response);
          return Promise.reject(error);
        }

        localStorage.setItem("accessToken", response.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;

        return axios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

axios.interceptors.request.use(function (config: any) {
  const token: any = localStorage.getItem("accessToken");
  if (!token) return config;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const routes: any = createBrowserRouter([
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/register",
    element: <RegisterView />,
  },
  {
    path: "/",
    element: <PanelView />,
    children: [
      {
      path: "panel",
      element: <RegistrationView />
      }
    ],
  },
]);

createRoot(document.getElementById(('root')!) as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>
);
