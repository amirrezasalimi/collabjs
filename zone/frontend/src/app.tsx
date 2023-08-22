import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './shared/styles/global.css';

import { NextUIProvider } from '@nextui-org/react';
import ManagerLayout from './shared/components/manager-layout';
import Manager from './modules/manager';
import Auth from './modules/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <ManagerLayout />,
            children: [
                {
                    path: "/manager",
                    element: <Manager />,
                },
                {
                    path: "/auth",
                    element: <Auth />,
                },
            ],
        },
    ]);

    return <>
        <RouterProvider router={router} />
        <NextUIProvider>
            <Outlet />
            <ToastContainer />
        </NextUIProvider>
    </>
}
export default App;