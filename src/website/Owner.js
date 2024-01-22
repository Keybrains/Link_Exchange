import { Typography, Card, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  // ... other icon imports
} from '@fortawesome/free-solid-svg-icons';

import Page from '../admin/components/Page';

export default function Owner() {
  const handleModerationClick = () => {
    // Functionality for passing moderation as Contributor
    // Add your logic here
  };
  return (
    <>
      <Page title="Add Web Site" sx={{ padding: '25px', overflow: 'hidden' }}>
        <Card style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
            Confirmation status
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ paddingBottom: '15px', color: '#677F9B', borderColor: '#677F9B' }}
          >
            Site owner
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ paddingBottom: '15px' }}>
            It’s a status that you need to select on your own. After you confirm the site’s ownership, you get extended
            rights over the site. You will be able to make any edits to it. Also, buyers have more trust when they are
            working with site owners. So, this role gives you better chances to get tasks or win the bids in the “Open
            offers.”
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ paddingBottom: '15px' }}>
            As soon as you add sites, you get the contributor status. To change it, go to “My platforms” and click
            either the "Unavailable for tasks" sign on your left or the "Are you owner? Confirm ownership" sign in the
            site information window to confirm the site owner status.
          </Typography>
          <Button variant="contained" onClick={handleModerationClick} sx={{ marginRight: '10px' }}>
            <FontAwesomeIcon icon={faFilter} style={{ marginRight: '5px' }} /> Confirm ownership
          </Button>
        </Card>
      </Page>
    </>
  );
}
