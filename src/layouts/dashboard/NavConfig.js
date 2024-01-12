// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  // {
  //   title: 'My Plateforms',
  //   path: '/user/dashboard',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  //   defaultOpen: true,
  // },
  {
    title: 'Search For Publishers',
    icon: getIcon('mdi:users'),
    defaultOpen: true,
    children: [
      {
        title: 'All Website',
        path: '/user/alluserwebsite',
        icon: getIcon('ion:social-buffer'),
      },
      {
        title: 'Free Website',
        path: '/user/freeuserwebsite',
        icon: getIcon('ion:social-buffer'),
      },
      {
        title: 'Paid Website',
        path: '/user/paiduserwebsite',
        icon: getIcon('material-symbols:paid-outline'),
      },
      // Add more dropdown options as needed
    ],
  },
  {
    title: 'Add Website',
    path: '/user/mywebsite',
    icon: getIcon('gg:website'),
  },

  {
    title: 'My Free Website',
    path: '/user/freewebsite',
    icon: getIcon('ion:social-buffer'),
  },
  {
    title: 'My Paid Website',
    path: '/user/paidwebsite',
    icon: getIcon('material-symbols:paid-outline'),
  },
  {
    title: 'My Reported Website',
    path: '/user/reportedwebsite',
    icon: getIcon('material-symbols:report'),
  },
  {
    title: 'My Pending Approval',
    path: '/user/pendingapproval',
    icon: getIcon('material-symbols:upcoming-outline'),
  },
  // {
  //   title: 'Discussions',
  //   path: '/user/discussions',
  //   icon: getIcon('material-symbols:chat'),
  // },
  {
    title: 'Chated User',
    path: '/user/chateduser',
    icon: getIcon('material-symbols:chat'),
  },
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
