import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard/DashboardLayout';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';

// user
import Terms from './website/Terms';
import AdminLogin from './admin/pages/AdminLogin';
import AdminRegister from './admin/pages/AdminRegister';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminDashboardLayout from './admin/layouts/dashboard/AdminDashboardLayout';
import AllWebsite from './admin/website/AllWebsite';
import WebsiteDashboard from './website/WebsiteDashboard';
import AddWebSite from './website/AddWebSite';
import WebSiteInfo from './website/WebSiteInfo';
import User from './admin/user/User';
import FreeWebsite from './website/FreeWebsite';
import PaidWebsite from './website/PaidWebsite';
import ReportedWebsite from './website/ReportedWebsite';
import Discussions from './Chat/Discussions';

// admin
import AdminDiscussions from './admin/website/Discussions';
import AdminFreeWebsite from './admin/website/FreeWebsite';
import AdminPaidWebsite from './admin/website/PaidWebsite';
import AdminReportedWebsite from './admin/website/ReportedWebsite';
import UpdateWebSiteInfo from './admin/website/UpdateWebSiteInfo';
import PendingApproval from './website/PendingApproval';
import UserDetail from './admin/user/UserDetail';
import WebsiteDetail from './admin/website/WebsiteDetail';
import UsersWebsite from './OtherUserWebsite/UsersWebsite';
import UsersFreeWebsite from './OtherUserWebsite/UsersFreeWebsite';
import UsersPaidWebsite from './OtherUserWebsite/UsersPaidWebsite';
import Chat from './Chat/Chat';
import ChatedUser from './Chat/ChatedUser';
import ChangePassword from './admin/user/ChangePassword';
import ReportedWebsiteDetail from './admin/website/ReportedWebsiteDetail';
import AdminChat from './Chat/AdminChat';
import Project from './admin/project/Project';

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
        { path: 'terms', element: isAuthenticated() ? <Terms /> : <Navigate to="/login" /> },
        { path: 'addwebsite', element: isAuthenticated() ? <AddWebSite /> : <Navigate to="/login" /> },
        { path: 'websiteinfo', element: isAuthenticated() ? <WebSiteInfo /> : <Navigate to="/login" /> },
        { path: 'freewebsite', element: isAuthenticated() ? <FreeWebsite /> : <Navigate to="/login" /> },
        { path: 'paidwebsite', element: isAuthenticated() ? <PaidWebsite /> : <Navigate to="/login" /> },
        { path: 'reportedwebsite', element: isAuthenticated() ? <ReportedWebsite /> : <Navigate to="/login" /> },
        {
          path: 'discussions',
          element: isAuthenticated() ? <Discussions /> : <Navigate to="/login" />,
        },
        { path: 'pendingapproval', element: isAuthenticated() ? <PendingApproval /> : <Navigate to="/login" /> },
        { path: 'alluserwebsite', element: isAuthenticated() ? <UsersWebsite /> : <Navigate to="/login" /> },
        { path: 'freeuserwebsite', element: isAuthenticated() ? <UsersFreeWebsite /> : <Navigate to="/login" /> },
        { path: 'paiduserwebsite', element: isAuthenticated() ? <UsersPaidWebsite /> : <Navigate to="/login" /> },
        { path: 'chat/:userId', element: isAuthenticated() ? <Chat /> : <Navigate to="/login" /> },
        { path: 'adminchat/:userId', element: isAuthenticated() ? <AdminChat /> : <Navigate to="/login" /> },
        { path: 'chateduser', element: isAuthenticated() ? <ChatedUser /> : <Navigate to="/login" /> },
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
        { path: 'alluser', element: isAuthenticated() ? <User /> : <Navigate to="/adminlogin" /> },
        { path: 'freewebsite', element: isAuthenticated() ? <AdminFreeWebsite /> : <Navigate to="/adminlogin" /> },
        { path: 'paidwebsite', element: isAuthenticated() ? <AdminPaidWebsite /> : <Navigate to="/adminlogin" /> },
        {
          path: 'reportedwebsite',
          element: isAuthenticated() ? <AdminReportedWebsite /> : <Navigate to="/adminlogin" />,
        },
        { path: 'discussions', element: isAuthenticated() ? <AdminDiscussions /> : <Navigate to="/adminlogin" /> },
        { path: 'addproject', element: isAuthenticated() ? <Project /> : <Navigate to="/adminlogin" /> },
        {
          path: 'updatesite/:websiteId',
          element: isAuthenticated() ? <UpdateWebSiteInfo /> : <Navigate to="/adminlogin" />,
        },
        { path: 'userdetail/:userId', element: isAuthenticated() ? <UserDetail /> : <Navigate to="/adminlogin" /> },
        {
          path: 'websitedetail/:websiteId',
          element: isAuthenticated() ? <WebsiteDetail /> : <Navigate to="/adminlogin" />,
        },

        {
          path: 'reportedwebsitedetail/:websiteId',
          element: isAuthenticated() ? <ReportedWebsiteDetail /> : <Navigate to="/adminlogin" />,
        },
        { path: 'changepassword', element: isAuthenticated() ? <ChangePassword /> : <Navigate to="/adminlogin" /> },
      ],
    },
  ]);
};

export default Router;
