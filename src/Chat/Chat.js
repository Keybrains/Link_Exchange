import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Button, TextField, DialogContent, DialogTitle, Dialog } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@mui/system';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import CircularProgress from '@mui/material/CircularProgress';
import Page from '../admin/components/Page';
import axiosInstance from '../config/AxiosInstance';

const StyledDialog = styled(Dialog)({
  '& .MuiDialogTitle-root': {
    backgroundColor: '#2196F3',
    color: '#ffffff',
    borderBottom: '1px solid #1565c0',
    paddingBottom: '8px',
  },
  '& .MuiDialogContent-root': {
    padding: '16px',
  },
  '& .MuiTextField-root': {
    marginBottom: '16px',
  },
  '& .MuiButton-root': {
    marginRight: '8px',
  },
  '& .MuiDialog-paper': {
    minWidth: '400px',
    minHeight: '300px',
    borderRadius: '10px',
  },
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const websiteName = urlParams.get('url');

    if (websiteName) {
      setMessage(`Hi, I want to discuss with you about (${websiteName}).`);
    }
  }, []);

  const handleSendMessage = async () => {
    try {
      const decodedToken = localStorage.getItem('decodedToken');
      const parsedToken = JSON.parse(decodedToken);
      const loggedInUserId = parsedToken.userId?.user_id;
  
      await axiosInstance.get(`/chatuser/chatuser/chat-messages/${loggedInUserId}/${userId}`)
        .then(response => {
          const data = {
            firstname: userDetail?.firstname,
            lastname: userDetail?.lastname,
            user_id: userId,
          };
          navigate('/user/chateduser', { state: data });
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            setOpenDialog(true);
          } else {
            console.error('Error checking messages:', error);
          }
        });
    } catch (error) {
      console.error('Error checking messages:', error);
    }
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
        receiver_id: loggedInUserId,
      };

      await axiosInstance.put(`/signup/signup/allusers/${userId}`, payload);

      const chatPayload = {
        receiver_id: userId,
        sender_id: loggedInUserId,
        message,
      };

      await axiosInstance.post('/chatuser/chat-messages', chatPayload);

      const notificationPayload = {
        receiver_id: userId,
        sender_id: loggedInUserId,
      };

      axiosInstance.post('/notification/notifications', notificationPayload);

      navigate('/user/chateduser', {
        state: {
          firstname: userDetail?.firstname,
          user_id: userId,
          lastname: userDetail?.lastname,
        },
      });

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
          {userDetail && (
            <section className="">
              <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                  <MDBCol lg="8" className="mb-2 mb-lg-0">
                    <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                      <MDBRow className="g-0">
                        <MDBCol
                          md="4"
                          className="gradient-custom text-center text-white d-flex flex-column justify-content-center align-items-center"
                          style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem', height: '400px' }}
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
                          <MDBIcon far icon="edit mb-5" />
                        </MDBCol>

                        <MDBCol md="8">
                          <MDBCardBody className="p-4 pb-4">
                            {/* ... */}
                            <MDBTypography tag="h6">Owner</MDBTypography>
                            <hr className="" />
                            <MDBRow className="">
                              <MDBCol size="6" className="">
                                <Button variant="contained" color="primary" onClick={handleSendMessage}>
                                  Chat with {userDetail?.firstname} {userDetail?.lastname}
                                </Button>
                                <StyledDialog open={openDialog} onClose={handleCloseDialog} position="fixed">
                                  <DialogTitle>
                                    Start Conversation with {userDetail?.firstname} {userDetail?.lastname}
                                  </DialogTitle>
                                  <DialogContent>
                                    <TextField
                                      label="Your Message"
                                      variant="outlined"
                                      fullWidth
                                      multiline
                                      rows={5}
                                      value={message}
                                      onChange={(e) => setMessage(e.target.value)}
                                      style={{ marginTop: '16px', marginBottom: '16px' }}
                                    />
                                  </DialogContent>
                                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                    <Button variant="contained" color="primary" onClick={handleSendButtonClick}>
                                      Send
                                    </Button>
                                  </div>
                                </StyledDialog>
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
