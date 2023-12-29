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
    title: 'All Website',
    path: '/admin/allwebsite',
    icon: getIcon('gg:website'),
  },
  {
    title: 'All Social Media',
    path: '/admin/allsocialmedia',
    icon: getIcon('ion:social-buffer'),
  },

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
