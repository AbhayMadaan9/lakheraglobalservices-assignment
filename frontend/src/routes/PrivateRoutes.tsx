import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
const UserLayout = lazy(() => import('../layouts/PrivateLayout'));
const Dashboard = lazy(() => import('../pages/private/Dashboard'));
const Tasks = lazy(() => import('../pages/private/Tasks'));
const Task = lazy(() => import('../pages/private/Task'));
function UserRoutes() {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/:id" element={<Task />} />
                <Route path="*" element={<Dashboard/>} />
            </Route>
        </Routes>
    );
}

export default UserRoutes;
