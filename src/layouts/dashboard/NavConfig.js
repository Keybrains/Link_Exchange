// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  // {
  //   title: 'My Dashboard',
  //   path: '/user/userdashboard',
  //   icon: getIcon('clarity:dashboard-line'),
  //   defaultOpen: true,
  // },
  {
    title: 'Search For Publisher',
    icon: getIcon('ic:baseline-search'),
    // defaultOpen: true,
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
    ],
  },
  {
    title: 'Add Website',
    path: '/user/mywebsite',
    icon: getIcon('icons8:plus'),
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
    title: 'My Pending Approval',
    path: '/user/pendingapproval',
    icon: getIcon('ph:dots-three-circle'),
  },
  {
    title: 'My Chats',
    path: '/user/chateduser',
    icon: getIcon('tabler:message'),
  },

];

export default navConfig;
