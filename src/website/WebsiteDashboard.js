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
    <Page title="WebsiteDashboard" sx={{ padding: '25px', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
        My Platforms
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
          How to work with this page
          <FontAwesomeIcon
            icon={isContentOpen ? faMinus : faPlus}
            style={{ marginLeft: 'auto', fontSize: '20px', color: 'black' }}
          />
        </Typography>
      </Card>

      {isContentOpen && (
        <Card sx={{ padding: '15px', overflow: 'hidden' }}>
          <Typography variant="body1" style={{ marginBottom: '10px' }}>
            There are two major statuses - either a site owner or a contributor. By default, publishers are allowed to
            work with sites only in the site owner status. If you want to continue working as a contributor you have to{' '}
            <a style={{ color: '#0000FF' }}>pass moderation.</a>
          </Typography>
          <Typography variant="body1">
            <b>On this page you can:</b>
          </Typography>
          <Typography variant="body1" style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
              <li>
                <a style={{ color: '#0000FF' }}>Add a website</a>
              </li>
              <li>
                <a style={{ color: '#0000FF' }}>
                  Read Link Exchange's requirements to the website (see clause 5.21 - 11)
                </a>
              </li>
              <li>See the brief overview of your websites and their statuses</li>
              <li>Check the detailed information about your website and update it</li>
              <li>
                Activate/deactivate the website <br />
                <small style={{ color: 'blue' }}>(i.e. put on hold the acceptance of tasks from buyers)</small>
              </li>
            </ul>
          </Typography>
          <Typography variant="body1" style={{ backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
            Reveal more details about Publisher’s Interface in{' '}
            <a style={{ color: '#0000FF' }}>Link Exchange Content Creation and Placement Tutorial.</a>
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ marginBottom: '15px' }}>
              <Typography variant="body1">
              <b><FontAwesomeIcon icon={faPlus} /> Add a website</b>
              </Typography>
              <Typography variant="body1">
                Want to monetize your site while placing or creating unique and relevant content? Just add your website
                to our inventory, get tasks from buyers and enjoy profit!
              </Typography>
              <Typography variant="body1">
                N.B. Don’t forget to <a style={{ color: '#0000FF' }}>work on your metrics</a> to grow them constantly.
                That increases your chances of receiving more tasks from buyers.
              </Typography>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Typography variant="body1">
              <b><FontAwesomeIcon icon={faFileAlt} /> Service type</b>
              </Typography>
              <Typography variant="body1">
                What are you going to do? You have 2 options:
                <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginBottom: '0' }}>
                  <li>
                    Place content provided by buyers on your website. Please set the price you’d like to get for content
                    placement.
                  </li>
                  <li>
                    Create different types of content (mini-post, article, long article) for buyers, and place it on
                    your site. Please set the price you’d like to get for content creation and placement.
                  </li>
                </ul>
              </Typography>
            </div>
            <div>
              <Typography variant="body1">
              <b><FontAwesomeIcon icon={faEye} /> Results</b>
              </Typography>
              <ul style={{ listStyleType: 'none', marginBottom: '0', padding: '0' }}>
                <li>Monetizing your site</li>
                <li>100% reliable payouts</li>
                <li>Higher Google rank for quality content</li>
                <li>100% control over the content placed on your site</li>
                <li>Sponsorship disclosure to keep your readers' trust</li>
              </ul>
            </div>
          </div>
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
    </Page>
  );
}
