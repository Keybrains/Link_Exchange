import { useState } from 'react';
import { Typography, Box, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';
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

const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  display: 'flex',
  // justifyContent: 'center',
  marginBottom: '20px',

  '& .MuiToggleButton-root': {
    // borderRadius: '20px',
    padding: '10px 20px',
    margin: '0 5px',
    color: '#fff',
    background: '#2196f3',

    '&.Mui-selected': {
      background: '#0d47a1',
      color: '#fff',
    },
  },
});

export default function OwnerOrContributor() {
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setSelectedRole(newRole);
    }
  };

  return (
    <Page title="Add Web Site" sx={{ padding: '25px', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
        Confirmation status
      </Typography>

      <StyledToggleButtonGroup value={selectedRole} exclusive onChange={handleRoleChange} aria-label="role">
        <ToggleButton value="contributor">Contributor</ToggleButton>
        <ToggleButton value="owner">Owner</ToggleButton>
      </StyledToggleButtonGroup>

      {selectedRole === 'owner' && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Owner Content
          </Typography>
        </Box>
      )}

      {selectedRole === 'contributor' && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Contributor Content
          </Typography>
        </Box>
      )}
    </Page>
  );
}
