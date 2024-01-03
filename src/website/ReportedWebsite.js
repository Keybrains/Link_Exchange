import { Typography } from '@mui/material';
import Page from '../components/Page';

export default function ReportedWebsite() {
  return (
    <Page title="AllWebsite" sx={{ padding: '25px', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
        No Reported Website
      </Typography>
    </Page>
  );
}
