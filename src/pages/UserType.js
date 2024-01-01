import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Typography, Button ,Card } from '@mui/material';

export default function UserType() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');

  const handleUserTypeSelection = (selectedType) => {
    setUserType(selectedType);
  };

  const handleRedirect = () => {
    if (userType === 'buyer') {
      navigate('/buyer'); // Redirect to buyer routes
    } else if (userType === 'publisher') {
      navigate('/user'); // Redirect to user routes
    }
  };

  return (
    <Container maxWidth="sm">
    <Card style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Select User Type
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <Button variant="contained" onClick={() => handleUserTypeSelection('buyer')}>
          Buyer
        </Button>
        <Button variant="contained" onClick={() => handleUserTypeSelection('publisher')}>
          Publisher
        </Button>
      </div>
      {userType && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button variant="contained" color="primary" onClick={handleRedirect}>
            Continue as {userType}
          </Button>
        </div>
      )}
    </Card>
  </Container>
  
  );
}
