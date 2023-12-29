import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard/DashboardLayout';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Blog from './pages/Blog';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import SocialMediaDashboard from './socialMedia/SocialMediaDashboard';
import Terms from './website/Terms';
import AdminLogin from './admin/pages/AdminLogin';
import AdminRegister from './admin/pages/AdminRegister';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminDashboardLayout from './admin/layouts/dashboard/AdminDashboardLayout';
import AllWebsite from './admin/website/AllWebsite';

import AllSociaMedia from './admin/socialMedia/AllSociaMedia';
import AdminLogoOnlyLayout from './admin/layouts/AdminLogoOnlyLayout';
import AdminPage404 from './admin/pages/AdminPage404';
import WebsiteDashboard from './website/WebsiteDashboard';
import AddWebSite from './website/AddWebSite';


const isAuthenticated = () => {
  const authToken = localStorage.getItem('authToken');
  return authToken !== null;
};

const Router = () => {
  return useRoutes([
    {
      path: '/user',
      element: isAuthenticated() ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'mywebsite', element: isAuthenticated() ? <WebsiteDashboard /> : <Navigate to="/login" /> },
        { path: 'mysocialmedia', element: isAuthenticated() ? <SocialMediaDashboard /> : <Navigate to="/login" /> },
        { path: 'terms', element: isAuthenticated() ? <Terms /> : <Navigate to="/login" /> },
        { path: 'addwebsite', element: isAuthenticated() ? <AddWebSite /> : <Navigate to="/login" /> },
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
    // --------------------------------------------------------admin----------------------------------------
    {
      path: '/adminlogin',
      element: <AdminLogin />,
    },
    {
      path: '/adminregister',
      element: <AdminRegister />,
    },
    // {
    //   path: '/admindashboard',
    //   element: <AdminDashboard />,
    // },
    {
      path: '/admin',
      element: isAuthenticated() ? <AdminDashboardLayout /> : <Navigate to="/adminlogin" />,
      children: [
        { path: 'admindashboard', element: isAuthenticated() ? <AdminDashboard /> : <Navigate to="/adminlogin" /> },
        { path: 'allwebsite', element: isAuthenticated() ? <AllWebsite /> : <Navigate to="/adminlogin" /> },
        { path: 'allsocialmedia', element: isAuthenticated() ? <AllSociaMedia /> : <Navigate to="/adminlogin" /> },
        // Other routes for Admin Panel 1
      ],
    },
  ]);
};

export default Router;
