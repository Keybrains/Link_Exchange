import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Typography, Card, Container, Box, Button, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';

export default function Terms() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const handleNavigate = () => {
    if (isChecked) {
      navigate('/user/addwebsite');
    } else {
      toast.error('Please agree to the terms to continue.');
    }
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <>
      <Page title="Terms & Conditions" sx={{ padding: '25px', overflow: 'hidden' }}>
        <Typography variant="h1" style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Terms and Conditions for Backlink Exchange
        </Typography>

        <hr style={{ width: '100%', height: '1px', backgroundColor: '#000', marginBottom: '1rem' }} />

        <Typography variant="body1" style={{ marginBottom: '1rem' }}>
          Welcome to our backlink exchange platform. These terms and conditions outline the rules and regulations for
          the use of our website. By accessing this website, we assume you accept these terms and conditions in full. Do
          not continue to use this website if you do not accept all of the terms and conditions stated on this page.
        </Typography>

        {/* Terms and Conditions list */}
        <ol style={{ marginBottom: '1rem', paddingLeft: '3rem' }}>
          {/* Backlink Exchange Process */}
          <li style={{ marginBottom: '1rem' }}>
            <b>Backlink Exchange Process:</b>
            <ol type="a">
              <li>Users may submit their websites for backlink exchange on our platform.</li>
              <li>
                Backlink exchange is based on a mutual agreement between website owners. Users are responsible for
                ensuring the relevance and quality of the backlinks exchanged. The Key Brains team is the final
                authority in case of a dispute.
              </li>
              <li>
                Users must adhere to the guidelines provided by search engines regarding backlinking practices. We are
                not responsible for any penalties incurred due to violations of these guidelines.
              </li>
            </ol>
          </li>
          {/* Eligibility */}
          <li style={{ marginBottom: '1rem' }}>
            <b>Eligibility:</b>
            <ol type="a">
              <li>
                Users must have legal ownership or authorization to manage the content on website(s) submitted for
                backlink exchange.
              </li>
              <li>
                We reserve the right to refuse or remove any website that violates our terms and conditions or fails to
                meet our quality standards.
              </li>
            </ol>
          </li>
          {/* Content Guidelines */}
          <li style={{ marginBottom: '1rem' }}>
            <b>Content Guidelines:</b>
            <p>
              Users must ensure that their websites do not contain any illegal, offensive, or inappropriate content.
            </p>
          </li>
          {/* Spam and Abuse */}
          <li style={{ marginBottom: '1rem' }}>
            <b>Spam and Abuse:</b>
            <ol type="a">
              <li>
                Users must not engage in spamming or abusive behavior on our platform. User should not submit a website
                with a spam score of more than 30.
              </li>
              <li>
                Any attempt to manipulate the backlink exchange process through unethical means will result in immediate
                removal from our platform.
              </li>
            </ol>
          </li>
          {/* Liability */}
          <li style={{ marginBottom: '1rem' }}>
            <b>Liability:</b>
            <ol type="a">
              <li>
                We do not guarantee the accuracy, reliability, or effectiveness of the backlinks exchanged on our
                platform.
              </li>
              <li>
                Users participate in the backlink exchange process at their own risk. We are not liable for any damages,
                losses, or disputes arising from the use of our platform.
              </li>
            </ol>
          </li>
          {/* Modification of Terms */}
          <li style={{ marginBottom: '1rem' }}>
            <b>Modification of Terms:</b>
            <p>
              We reserve the right to modify these terms and conditions at any time without prior notice. It is the
              user's responsibility to regularly review these terms for updates.
            </p>
          </li>
        </ol>

        <Typography variant="body1" style={{ marginTop: '1rem', marginLeft: '10px' }}>
          By using our website, you hereby consent to our terms and conditions and agree to abide by them.
        </Typography>

        <Box display="flex" alignItems="center" style={{ paddingTop: '10px' }}>
          <Checkbox checked={isChecked} onChange={handleCheckboxChange} style={{ marginRight: '8px' }} />
          <Typography variant="body1">I agree to the terms and conditions</Typography>
        </Box>

        <Button
          onClick={handleNavigate}
          variant="contained"
          style={{ backgroundColor: '#1E90FF', padding: '10px', color: '#fff', fontWeight: 'bold', marginTop: '20px' }}
        >
          Agree & Continue
        </Button>
      </Page>
      <Toaster />
    </>
  );
}
