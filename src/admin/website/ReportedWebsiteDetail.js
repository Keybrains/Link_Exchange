import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip, Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@mui/system';
import { faUser, faMoneyBill, faBarsProgress, faCircleInfo, faLink, faBug } from '@fortawesome/free-solid-svg-icons';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import CircularProgress from '@mui/material/CircularProgress';
import Page from '../components/Page';
import axiosInstance from '../config/AxiosInstanceAdmin';

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

export default function ReportedWebsiteDetail() {
  const { websiteId } = useParams();
  const [websiteDetail, setWebsiteDetail] = useState({});

  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const fetchWebsiteDetail = async (websiteId) => {
    try {
      const response = await axiosInstance.get(`/website/websitesdetail?website_id=${websiteId}`);
      if (response.data && response.data.success) {
        setWebsiteDetail(response.data.data);

        setLoading(false);
      } else {
        console.error('No data found in response:', response);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching website details:', error);
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const toggleStatusAndDeleteReportedWebsite = async () => {
    try {
      const response = await axiosInstance.put(`/reportedwebsite/reportedwebsite/toggle-status/${websiteId}`);

      if (response.data && response.data.success) {
        const deleteResponse = await axiosInstance.delete(`/reportedwebsite/deletereportedwebsite/${websiteId}`);
        if (deleteResponse.data && deleteResponse.data.success) {
          navigate('/admin/allwebsite');
        } else {
          console.error('Failed to delete reported website:', deleteResponse.data.message);
        }

        fetchWebsiteDetail();
      } else {
        console.error('Failed to toggle status:', response.data.message);
      }
    } catch (error) {
      console.error('Error toggling status and deleting reported website:', error);
    } finally {
      setOpenDialog(false);
    }
  };

  useEffect(() => {
    fetchWebsiteDetail(websiteId);
  }, [websiteId]);

  const handleSendButtonClick = async () => {
    try {
      const decodedToken = localStorage.getItem('decodedToken');
      const parsedToken = JSON.parse(decodedToken);
      const loggedInUserId = parsedToken.userId?.user_id;

      const updatePayload = {
        receiver_id: loggedInUserId,
      };
      await axiosInstance.put(`/signup/signup/allusers/${websiteDetail.user?.user_id}`, updatePayload);

      const chatPayload = {
        receiver_id: websiteDetail.user?.user_id,
        sender_id: loggedInUserId,
        message,
      };
      await axiosInstance.post('/chatuser/chat-messages', chatPayload);

      const notificationPayload = {
        receiver_id: websiteDetail.user?.user_id,
        sender_id: loggedInUserId,
      };

      await axiosInstance.post('/notification/notifications', notificationPayload);

      await toggleStatusAndDeleteReportedWebsite();

      setOpenDialog(false);
    } catch (error) {
      console.error('Error sending message and toggling status:', error);
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
          {websiteDetail && (
            <section style={{ overflow: 'hidden' }}>
              <MDBContainer className="py-3 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                  <MDBCol lg="12" className="mb-2 mb-lg-0">
                    <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                      <MDBRow className="g-0">
                        <MDBCol>
                          <MDBCardBody className="p-4 pb-4">
                            <MDBTypography tag="h5" className="pb-2" style={{ color: '#145DA0' }}>
                              <FontAwesomeIcon
                                icon={faUser}
                                style={{
                                  paddingRight: '5px',
                                }}
                              />
                              User Detail
                            </MDBTypography>

                            <hr className="mt-0 mb-3" />
                            <MDBRow>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Name:
                                </MDBTypography>
                                <MDBCardText className="text-muted">
                                  {websiteDetail.user?.firstname} {websiteDetail.user?.lastname}
                                </MDBCardText>
                              </MDBCol>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Username:
                                </MDBTypography>
                                <MDBCardText className="text-muted">{websiteDetail.user?.username}</MDBCardText>
                              </MDBCol>
                            </MDBRow>
                            <MDBRow>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Phone Number :
                                </MDBTypography>
                                <MDBCardText className="text-muted"> {websiteDetail.user?.phonenumber}</MDBCardText>
                              </MDBCol>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Email:
                                </MDBTypography>
                                <MDBCardText className="text-muted">{websiteDetail.user?.email}</MDBCardText>
                              </MDBCol>
                            </MDBRow>

                            {websiteDetail.reportedWebsites && (
                              <>
                                <MDBTypography tag="h5" className="pb-2 pt-2" style={{ color: 'red' }}>
                                  <FontAwesomeIcon
                                    icon={faBug}
                                    style={{
                                      paddingRight: '5px',
                                    }}
                                  />
                                  Reported
                                </MDBTypography>

                                <hr className="mt-0 mb-3" />
                                <MDBRow>
                                  <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                    <MDBTypography tag="h6" className="me-2">
                                      User Message:
                                    </MDBTypography>
                                    <MDBCardText className="text-muted">
                                      {websiteDetail.reportedWebsites?.message}
                                    </MDBCardText>
                                  </MDBCol>
                                </MDBRow>
                              </>
                            )}

                            <MDBTypography tag="h5" className="pb-2 pt-2" style={{ color: '#145DA0' }}>
                              <FontAwesomeIcon
                                icon={faLink}
                                style={{
                                  paddingRight: '5px',
                                }}
                              />
                              URL
                            </MDBTypography>

                            <hr className="mt-0 mb-2" />
                            <MDBRow className="pt-1 pb-2 pt-2">
                              <MDBCol size="12" className="mb-3">
                                <MDBCardText className="text-muted" style={{ fontSize: '20px' }}>
                                  {websiteDetail.website?.url}
                                </MDBCardText>
                              </MDBCol>
                            </MDBRow>

                            <MDBTypography tag="h5" className="pb-2 pt-2" style={{ color: '#145DA0' }}>
                              <FontAwesomeIcon
                                icon={faLink}
                                style={{
                                  paddingRight: '5px',
                                }}
                              />
                              Backlink
                            </MDBTypography>

                            <hr className="mt-0 mb-2" />
                            <MDBRow className="pt-1 pb-2 pt-2">
                              <MDBCol size="12" className="mb-3">
                                <MDBCardText className="text-muted" style={{ fontSize: '20px' }}>
                                  {websiteDetail.website?.backlink}
                                </MDBCardText>
                              </MDBCol>
                            </MDBRow>

                            <MDBTypography tag="h5" className="pb-2 pt-2" style={{ color: '#145DA0' }}>
                              <FontAwesomeIcon
                                icon={faCircleInfo}
                                style={{
                                  paddingRight: '5px',
                                }}
                              />
                              Other Detail
                            </MDBTypography>
                            <hr className="mt-0 mb-3" />
                            <MDBRow>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Organic Visits :
                                </MDBTypography>
                                <MDBCardText className="text-muted">
                                  {' '}
                                  {websiteDetail.website?.monthlyVisits}
                                </MDBCardText>
                              </MDBCol>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Domain Authority :
                                </MDBTypography>
                                <MDBCardText className="text-muted">{websiteDetail.website?.DA}</MDBCardText>
                              </MDBCol>
                            </MDBRow>
                            <MDBRow>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Spam Score :
                                </MDBTypography>
                                <MDBCardText className="text-muted">{websiteDetail.website?.spamScore}</MDBCardText>
                              </MDBCol>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Link Period :
                                </MDBTypography>
                                <MDBCardText className="text-muted">{websiteDetail.website?.linkTime}</MDBCardText>
                              </MDBCol>
                            </MDBRow>
                            <MDBRow>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Link Quantity :
                                </MDBTypography>
                                <MDBCardText className="text-muted">
                                  {websiteDetail.website?.backlinksAllowed}
                                </MDBCardText>
                              </MDBCol>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Country :
                                </MDBTypography>
                                <MDBCardText className="text-muted">{websiteDetail.website?.country}</MDBCardText>
                              </MDBCol>
                            </MDBRow>
                            <MDBRow>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Language :
                                </MDBTypography>
                                <MDBCardText className="text-muted">{websiteDetail.website?.language}</MDBCardText>
                              </MDBCol>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Google News :
                                </MDBTypography>
                                <MDBCardText className="text-muted">
                                  {' '}
                                  {websiteDetail.website?.surfaceInGoogleNews ? 'Yes' : 'No'}
                                </MDBCardText>
                              </MDBCol>
                            </MDBRow>
                            <MDBRow>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Link Type :
                                </MDBTypography>
                                <MDBCardText className="text-muted">{websiteDetail.website?.linkType}</MDBCardText>
                              </MDBCol>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Reported :
                                </MDBTypography>
                                <MDBCardText className="text-muted">
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span
                                      style={{
                                        marginBottom: '5px',
                                        color: websiteDetail.website?.reported ? 'red' : 'initial',
                                      }}
                                    >
                                      {websiteDetail.website?.reported ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                </MDBCardText>
                              </MDBCol>
                            </MDBRow>

                            <MDBTypography tag="h5" className="pb-2 pt-2" style={{ color: '#145DA0' }}>
                              <FontAwesomeIcon
                                icon={faMoneyBill}
                                style={{
                                  paddingRight: '5px',
                                }}
                              />
                              Cost
                            </MDBTypography>
                            <hr className="mt-0 mb-3" />
                            <MDBRow>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Cost Of Adding Backlink :
                                </MDBTypography>
                                <MDBCardText className="text-muted">
                                  {websiteDetail.website?.costOfAddingBacklink}
                                </MDBCardText>
                              </MDBCol>
                              <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Cost :
                                </MDBTypography>
                                <MDBCardText className="text-muted">
                                  {' '}
                                  ${websiteDetail.website?.charges || 0}
                                </MDBCardText>
                              </MDBCol>
                            </MDBRow>

                            <MDBTypography tag="h5" className="pt-2" style={{ color: '#145DA0' }}>
                              <FontAwesomeIcon
                                icon={faBarsProgress}
                                style={{
                                  paddingRight: '5px',
                                }}
                              />
                              Status
                            </MDBTypography>
                            <hr className="" />
                            <MDBRow className="">
                              <MDBCol size="6" className="">
                                <>
                                  {websiteDetail.website?.status === 'activate' && (
                                    <Tooltip title="To Deactivate URL - Click Here">
                                      <Button
                                        variant="outlined"
                                        onClick={handleToggleStatus}
                                        style={{ color: 'green', borderColor: 'green' }}
                                      >
                                        Activate
                                      </Button>
                                    </Tooltip>
                                  )}
                                </>
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
          <StyledDialog open={openDialog} onClose={handleCloseDialog} position="fixed">
            <DialogTitle>
              Start Conversation with {websiteDetail.user?.firstname} {websiteDetail.user?.lastname}
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
        </>
      )}
    </Page>
  );
}
