import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
const NotFound = lazy(() => import('../pages/public/NotFound'));
const UserLayout = lazy(() => import('../layouts/PrivateLayout'));
const Dashboard = lazy(() => import('../pages/private/Dashboard'));
const Tasks = lazy(() => import('../pages/private/Tasks'));

function UserRoutes() {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default UserRoutes;
