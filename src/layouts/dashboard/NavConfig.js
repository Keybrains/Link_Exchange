// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'My Plateforms',
    path: '/user/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
    defaultOpen: true,
  },
  {
    title: 'Add Website',
    path: '/user/mywebsite',
    icon: getIcon('gg:website'),
  },
  {
    title: 'Pending Approval',
    path: '/user/pendingapproval',
    icon: getIcon('material-symbols:upcoming-outline'),
  },
  {
    title: 'Free Website',
    path: '/user/freewebsite',
    icon: getIcon('ion:social-buffer'),
  },
  {
    title: 'Paid Website',
    path: '/user/paidwebsite',
    icon: getIcon('material-symbols:paid-outline'),
  },
  {
    title: 'Reported Website',
    path: '/user/reportedwebsite',
    icon: getIcon('material-symbols:report'),
  },
  {
    title: 'Discussions',
    path: '/user/discussions',
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
