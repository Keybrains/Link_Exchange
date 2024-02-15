import { useState } from 'react';
import { Typography, Card, Container, Box, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMailBulk,
  faQuestion,
  faPlus,
  faMinus,
  faFileAlt,
  faEye,
  faEdit,
  faToggleOn,
  faInfoCircle,
  // ... other icon imports
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import Page from '../admin/components/Page';

export default function WebsiteDashboard() {
  const [isContentOpen, setIsContentOpen] = useState(false);

  const handleContentToggle = () => {
    setIsContentOpen((prevValue) => !prevValue);
  };
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/user/terms');
  };

  return (
    <Page title="Add Web Site" >
      <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
        Add Website
      </Typography>

      <Card
        onClick={handleContentToggle}
        sx={{
          paddingX: '10px',
          paddingY: '20px',
          borderRadius: 1,
          border: '1px solid #ccc',
          backgroundColor: '#82CAFF',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        <Typography variant="body1" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faQuestion} style={{ marginRight: '8px', fontSize: '20px' }} />
          How to use this system
          <FontAwesomeIcon
            icon={isContentOpen ? faMinus : faPlus}
            style={{ marginLeft: 'auto', fontSize: '20px', color: 'black' }}
          />
        </Typography>
      </Card>

      {isContentOpen && (
        <Card sx={{ padding: '15px', overflow: 'hidden' }}>
          <Typography variant="h6" gutterBottom>
            Here is how you can add your website in a few simple steps:
          </Typography>
          <ol style={{ paddingLeft: '20px' }}>
            <li>Click the 'Add a website' button.</li>
            <li>Agree to the terms and conditions and click the 'Agree and Continue' button.</li>
            <li>
              Enter the URL or the domain of your website. No domain extension is allowed in the first step. Click the
              'Add' button. A new box will appear.
            </li>
            <li>
              In this box, enter the URL where you inserted our backlink. For example, you can add our backlink on the
              page www.mydomain.com/linkpage. Once adding the correct page URL, click the 'Submit' button.
            </li>
            <li>
              Carefully enter the information required, such as Monthly Organic Visits, the category of your website
              (you can select multiple categories), Domain Authority, what type of link you will provide (do-follow or
              no-follow), and more.
            </li>
            <li>
              Specify the spam score of your website, which country your website is viewed the most, how many backlinks
              you would give if anyone sends you a request, and the default language of your website.
            </li>
            <li>
              Choose if you will provide a free backlink for an exchange or if you will charge some amount. Mention the
              period that the backlink will be available (specific days or forever).
            </li>
            <li>Select if your website appears in Google News or not.</li>
            <li>
              Click the 'Submit' button. Wait for the approval by our team. We usually approve sites within 24 hours if
              they are eligible, but it might take longer during high demand.
            </li>
            <li>
              If your website is approved, it will appear in the search results. If it is not approved, our team will
              inform you of the reason, and you can apply again. If you think that no action has been taken, then you
              can contact the team through the 'Contact Admin' button.
            </li>
          </ol>
        </Card>
      )}
      <Box
        className="green-line"
        sx={{
          backgroundColor: '#E0F2F1',
          padding: '20px',
          marginY: '20px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="body1"
          className="green-line__text"
          sx={{
            flexGrow: 1,
            marginBottom: { xs: '20px', md: 0 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Want to monetize your site while placing or creating unique and relevant content?
        </Typography>
        <Button
          variant="contained"
          className="button button--black green-line__button"
          onClick={handleNavigate}
          sx={{
            marginLeft: { xs: 0, md: '20px' },
          }}
        >
          Add website
        </Button>
      </Box>
      {/* YouTube Video Embed */}
      <Card sx={{ marginBottom: '20px' }}>
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/NGYUJIQkXo0?autoplay=1&mute=1"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Card>
    </Page>
  );
}
