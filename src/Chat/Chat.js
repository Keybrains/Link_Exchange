import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  Button,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@mui/system';
import { faUser, faEnvelope, faPhone, faBuilding, faUserCircle, faDotCircle } from '@fortawesome/free-solid-svg-icons';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBIcon,
} from 'mdb-react-ui-kit';
import CircularProgress from '@mui/material/CircularProgress';
import Page from '../admin/components/Page';

import axiosInstance from '../config/AxiosInstance';

const IconWrapper = styled('span')({
  marginRight: '8px',
  fontSize: '20px',
});

export default function Chat() {
  const { userId } = useParams();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axiosInstance.get(`/signup/users/${userId}`);
        setUserDetail(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

  const handleSendMessage = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSendButtonClick = async () => {
    try {
      const decodedToken = localStorage.getItem('decodedToken');
      const parsedToken = JSON.parse(decodedToken);
      const loggedInUserId = parsedToken.userId?.user_id;

      const payload = {
        receiver_id: loggedInUserId, // Assuming you want to update the logged-in user's chateduser field
      };

      // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint for updating the user details
      const updateUserResponse = await axiosInstance.put(`/signup/signup/users/${userId}`, payload);

      console.log('User details updated successfully:', updateUserResponse.data);

      const chatPayload = {
        receiver_id: userId,
        sender_id: loggedInUserId,
        message,
      };

      // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint for sending messages
      const sendMessageResponse = await axiosInstance.post('/chatuser/chat-messages', chatPayload);

      console.log('Message sent successfully:', sendMessageResponse.data);
      navigate('/user/chateduser'); 
      setOpenDialog(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Page title="User Detail">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Typography variant="h4" gutterBottom style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
            {/* User Detail */}
          </Typography>
          {userDetail && (
            <section className="">
              <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                  <MDBCol lg="9" className="mb-2 mb-lg-0">
                    <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                      <MDBRow className="g-0">
                        <MDBCol
                          md="4"
                          className="gradient-custom text-center text-white d-flex flex-column justify-content-center align-items-center"
                          style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            style={{
                              fontSize: '3em',
                              marginBottom: '25px',
                              marginTop: '25px',
                            }}
                          />
                          <MDBTypography tag="h5">
                            {userDetail.firstname} {userDetail.lastname}
                          </MDBTypography>
                          <MDBCardText>{userDetail.username}</MDBCardText>
                          <MDBIcon far icon="edit mb-5" />
                        </MDBCol>

                        <MDBCol md="8">
                          <MDBCardBody className="p-4 pb-4">
                            <MDBTypography tag="h6">Owner Detail</MDBTypography>
                            <hr className="mt-0 mb-2" />
                            <MDBRow className="pt-1 pb-4 pt-3">
                              <MDBCol size="6" className="mb-3">
                                <MDBTypography tag="h6">Email</MDBTypography>
                                <MDBCardText className="text-muted">{userDetail.email}</MDBCardText>
                              </MDBCol>
                              <MDBCol size="6" className="mb-3">
                                <MDBTypography tag="h6">Phone</MDBTypography>
                                <MDBCardText className="text-muted">{userDetail.phonenumber}</MDBCardText>
                              </MDBCol>
                            </MDBRow>

                            <MDBTypography tag="h6">Company Detail</MDBTypography>
                            <hr className="mt-0 mb-2" />
                            <MDBRow className="pt-1 pb-4 pt-3">
                              <MDBCol size="6" className="mb-3">
                                <MDBTypography tag="h6">Company Name:</MDBTypography>
                                <MDBCardText className="text-muted">{userDetail.companyname}</MDBCardText>
                              </MDBCol>
                            </MDBRow>

                            <MDBTypography tag="h6">Contact</MDBTypography>
                            <hr className="" />
                            <MDBRow className="">
                              <MDBCol size="6" className="">
                                <Button variant="contained" color="primary" onClick={handleSendMessage}>
                                  Chat with {userDetail?.firstname}
                                </Button>
                                <Dialog open={openDialog} onClose={handleCloseDialog}>
                                  <DialogTitle>Send Message</DialogTitle>
                                  <DialogContent>
                                    <TextField
                                      label="Your Message"
                                      variant="outlined"
                                      fullWidth
                                      value={message}
                                      onChange={(e) => setMessage(e.target.value)}
                                    />
                                  </DialogContent>
                                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                    <Button variant="contained" color="primary" onClick={handleSendButtonClick}>
                                      Send
                                    </Button>
                                  </div>
                                </Dialog>
                              </MDBCol>
                            </MDBRow>
                          </MDBCardBody>
                        </MDBCol>
                      </MDBRow>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </section>
          )}
        </>
      )}
    </Page>
  );
}
