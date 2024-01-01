import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Box,
  Button,
  TextField,
  Link,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardContent,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMailBulk,
  faQuestion,
  faPlus,
  faMinus,
  faFilter,
  // ... other icon imports
} from '@fortawesome/free-solid-svg-icons';

import Page from '../admin/components/Page';

const handleModerationClick = () => {
  // Functionality for passing moderation as Contributor
  // Add your logic here
  console.log('Pass moderation as Contributor clicked');
};

const handleAddWithoutConfirmationClick = () => {
  // Functionality for adding without confirmation
  // Add your logic here
  console.log('Add without confirmation clicked');
};
export default function Contributor() {
  return (
    <>
      <Page title="Add Web Site" sx={{ padding: '25px', overflow: 'hidden' }}>
        <Card style={{padding:"20px"}}>
          <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
            Confirmation status
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ paddingBottom: '15px', color: '#677F9B', borderColor: '#677F9B' }}
          >
            Contributor
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ paddingBottom: '15px' }}>
            It’s a status you automatically get after you add a site or a list of sites. The websites’ number is not
            limited. Yet, only the first 100 of them will become available to buyers if you are in the contributor
            status. We will check and gradually lift the limit when you prove your ability to complete the tasks (by
            publishing content on the added sites).
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ paddingBottom: '15px' }}>
            You can also edit information about the sites you’ve added. Yet, notice that you will have limited access to
            this function. If the site was added before you or has an owner, you won’t be able to make some changes.
          </Typography>
          <Button variant="contained" onClick={handleModerationClick} sx={{ marginRight: '10px' }}>
            <FontAwesomeIcon icon={faFilter} style={{ marginRight: '5px' }} /> Pass moderation as Contributor
          </Button>
          <Button
            variant="contained"
            onClick={handleAddWithoutConfirmationClick}
            style={{ backgroundColor: '#677F9B', borderColor: '#677F9B' }}
          >
            Add without confirmation
          </Button>
        </Card>
      </Page>
    </>
  );
}
