import { useState } from 'react';
import { Typography, Card, Container, Box, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMailBulk,
  faQuestion,
  faPlus,
  faMinus,
  // ... other icon imports
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import Page from '../admin/components/Page';

export default function AddWebSite() {

  return (
    <Page title="Add Web Site" sx={{ padding: '25px', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
        Add Website's
      </Typography>
    </Page>
  );
}
