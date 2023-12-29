import { useState } from 'react';
import { Typography, Card, Container, Box, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMailBulk,
  faQuestion,
  faPlus,
  faMinus,
  faExclamationCircle,
  // ... other icon imports
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

// import { Link } from 'react-router-dom';
import Page from '../components/Page';

export default function Terms() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/user/addwebsite');
  };
  return (
    <Page title="Terms" sx={{ padding: '25px', overflow: 'hidden' }}>
      <Typography variant="h1" style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold' }}>
        Terms and conditions
      </Typography>

      <Box style={{ width: '50%', height: '1px', backgroundColor: '#000', marginBottom: '1rem' }} />

      <Typography variant="h2" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        By continuing, you agree to the following conditions:
      </Typography>
      <Card sx={{ padding: '25px', overflow: 'hidden' }}>
        <ol style={{ marginBottom: '1rem', paddingLeft: '3rem' }}>
          <li style={{ marginBottom: '1rem' }}>
            By default, you add all sites as a contributor. If you are a site owner, you will be able to verify your
            ownership after you have added the site.
          </li>
          <li style={{ marginBottom: '1rem' }}>
            As a contributor, you confirm that you have a legal right to post content on the site(s) added by you to
            Adsy. You also confirm that it has been granted to you by the site(s) owner(s).
          </li>
          <li style={{ marginBottom: '1rem' }}>
            You understand that if the verified website owner contacts Adsy with a claim that they have not authorized
            anyone else to post content on their website, Adsy will suspend your account and report your contact
            information to the website owner.
          </li>
          <li style={{ marginBottom: '1rem' }}>
            You understand that if you fail to prove your ability to post content on the website by not completing
            accepted buyers’ tasks, Adsy will suspend your account.
          </li>
          <li style={{ marginBottom: '1rem' }}>Free web-hosting is forbidden.</li>
          <li style={{ marginBottom: '1rem' }}>Website must have unique, readable, and frequently updated content.</li>
          <li style={{ marginBottom: '1rem' }}>
            Limited amount of website space is allowed to be covered with advertising in order not to disturb website
            visitors. Website must not have any intrusive advertising, pop-ups, pop-unders, click-unders, etc. Website
            must have a reasonable number of outgoing links and must not be spammy.
          </li>
          <li style={{ marginBottom: '1rem' }}>Websites that violate the laws of the USA are forbidden.</li>
          <li style={{ marginBottom: '1rem' }}>Websites that violate copyrights are forbidden.</li>
          <li style={{ marginBottom: '1rem' }}>
            Websites that do not conform to the public moral and ethical standards are forbidden.
          </li>
          <li style={{ marginBottom: '1rem' }}>Forbidden website categories</li>
          <li style={{ marginBottom: '1rem' }}>
            Moderator also evaluates websites from a user perspective. Thus, a website can be rejected if it is not
            visually appealing and user-friendly.
          </li>
        </ol>

        <Typography
          variant="body1"
          style={{ backgroundColor: '#fff', marginBottom: '5px', padding: '10px', color: 'red' }}
        >
          <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: '1px', fontSize: '20px' }} />{' '}
          {/* Added Font Awesome icon */}
          Moderation decision can be changed by Administration after the website has been approved or rejected. The
          website can be rejected after having been approved if its quality has deteriorated, and it is no longer in
          conformity with existing moderation rules.
        </Typography>

        <Typography variant="h2" style={{ fontSize: '1.5rem', marginBottom: '1rem', marginLeft: '1rem' }}>
          Payment terms:
        </Typography>

        <Typography variant="body1" style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
          Withdrawals can be made to your PayPal account only. Please note that the final sum you receive to your PayPal
          account will differ from the one you see on your Adsy account. That’s because we charge a 7.9% commission. It
          consists of two parts.
        </Typography>

        <Box variant="body1" style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
          4% - PayPal takes from 2.9% to 6.4% commission; to save you some funds, we’ll take only 4% from your balance
          and pay PayPal commission on our side, so this way you’ll save on PayPal commission and get payment with NO
          commission (applies to all publishers)
        </Box>

        <Box variant="body1" style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
          3.9% - the fee Adsy uses for advertising to attract more buyers and ensure you receive higher income (the
          commission applies to the publishers who’ve joined Adsy after August 1, 2018)
        </Box>

        <Typography
          variant="body1"
          style={{ backgroundColor: '#fff', marginBottom: '5px', padding: '10px', color: 'red' }}
        >
          <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: '1px', fontSize: '20px' }} />{' '}
          {/* Added Font Awesome icon */}
          Payments are usually made from the 26th day of the current month to the 5th day of the next month. Make sure
          to request your payment until the 25th day of the current month.
          <b>Please also note that the minimum withdrawal sum is 60 USD</b>.
        </Typography>
      </Card>
      <Button
        onClick={handleNavigate}
        variant="body1"
        style={{ backgroundColor: '#1E90FF', padding: '10px', color: '#fff', fontWeight: 'bold', marginTop: '20px' }}
      >
        Agree & Continue
      </Button>
    </Page>
  );
}
