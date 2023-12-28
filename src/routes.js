import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';

const isAuthenticated = () => {
  const authToken = localStorage.getItem('authToken');
  return authToken !== null;
};

const Router = () => {
  return useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated() ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'mywebsite', element: isAuthenticated() ? <User /> : <Navigate to="/login" /> },
        { path: 'mysocialmedia', element: isAuthenticated() ? <Products /> : <Navigate to="/login" /> },
        { path: 'blog', element: isAuthenticated() ? <Blog /> : <Navigate to="/login" /> },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
};

export default Router;
