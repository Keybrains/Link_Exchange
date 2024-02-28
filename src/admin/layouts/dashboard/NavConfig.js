// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/admin/admindashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
    // defaultOpen: true,
  },
  {
    title: 'All User',
    path: '/admin/alluser',
    icon: getIcon('mdi:user'),
    // defaultOpen: true,
  },
  {
    title: 'Approve Request',
    path: '/admin/allwebsite',
    icon: getIcon('gg:website'),
  },

  {
    title: 'Free Website',
    path: '/admin/freewebsite',
    icon: getIcon('ion:social-buffer'),
  },
  {
    title: 'Paid Website',
    path: '/admin/paidwebsite',
    icon: getIcon('material-symbols:paid-outline'),
  },
  {
    title: 'Reported Website',
    path: '/admin/reportedwebsite',
    icon: getIcon('material-symbols:report'),
  },
  {
    title: 'Contact Users',
    path: '/admin/discussions',
    icon: getIcon('material-symbols:chat'),
  },
  {
    title: 'Add category',
    path: '/admin/category',
    icon: getIcon('material-symbols:category'),
  },
  {
    title: 'Add Ads',
    path: '/admin/addproject',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'Change Password',
    path: '/admin/changepassword',
    icon: getIcon('mdi:password-reset'),
  },

  // {
  //   title: 'All Social Media',
  //   path: '/admin/allsocialmedia',
  //   icon: getIcon('ion:social-buffer'),
  // },

  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
