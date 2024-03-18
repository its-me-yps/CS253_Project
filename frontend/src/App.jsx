import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

//importing pages
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import WashermanSelection from './pages/WashermanSelection';
import RegisterStudent from './pages/RegisterStudent';
import ResetPassword from './pages/ResetPassword';
import StudentDashboard from './pages/StudentDashboard';
import WashermanDashboard from './pages/WashermanDashboard';
import WashClothes from './pages/WashClothes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
        errorElement: <NotFound />
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/ResetPassword',
        element: <ResetPassword />,
    },
    {
        path: '/RegisterStudent',
        element: <RegisterStudent />,
    },
    {
        path: '/WashermanSelection',
        element: <WashermanSelection />,
    },
    {
        path: '/StudentDashboard',
        element: <StudentDashboard />,
    },
    {
        path: '/WashClothes',
        element: <WashClothes />,
    },
    {
        path: '/WashermanDashboard',
        element: <WashermanDashboard />,
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

const App = () =>{
    return (
        <RouterProvider  router={router} />
    );
}

export default App;
