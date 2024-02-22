import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip, Button, Stack, Chip, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMoneyBill,
  faBarsProgress,
  faCircleInfo,
  faLink,
  faBug,
  faImage,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import CircularProgress from '@mui/material/CircularProgress';
import { PhotoCamera } from '@mui/icons-material';
import Page from '../components/Page';
import axiosInstance from '../config/AxiosInstance';

export default function UserWebsiteDetail() {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const [websiteDetail, setWebsiteDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const fetchWebsiteDetail = async (websiteId) => {
    try {
      const response = await axiosInstance.get(`/website/websitesdetail?website_id=${websiteId}`);
      if (response.data && response.data.success) {
        setWebsiteDetail(response.data.data);
        console.log('response', response);
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

  useEffect(() => {
    fetchWebsiteDetail(websiteId);
  }, [websiteId, fileName]);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    console.log(selectedFile);
    setFile(selectedFile);
    setFileName(selectedFile.name);

    await handleUpload(selectedFile);
  };

  // Adjust handleUpload to accept a file parameter
  const handleUpload = async (selectedFile) => {
    const formData = new FormData();
    formData.append('files', selectedFile);

    try {
      const uploadResponse = await axios.post('https://propertymanager.cloudpress.host/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imagePath = uploadResponse.data.files[0].url;
      const imageName = imagePath.split('/').pop();

      // Ensure `websiteId` is correctly defined and accessible
      const response = await axiosInstance.put(`/website/websites/${websiteId}`, {
        image: imageName,
      });
      console.log('Upload successful', response);

      setFileName('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  const basePath = 'https://propertymanager.cloudpress.host/api/images/upload/images/';

  const handleFileRemoval = async () => {
    if (!fileName) return;

    try {
      const response = await axiosInstance.put(`/website/websites/${websiteId}`, {
        image: null,
      });
      console.log('File removal response:', response);
    } catch (error) {
      console.error('Error during file removal:', error.response || error);
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
                              Owner Detail
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
                              {/* <MDBCol size="12" lg="6" className="mb-3 d-flex">
                                <MDBTypography tag="h6" className="me-2">
                                  Username:
                                </MDBTypography>
                                <MDBCardText className="text-muted">{websiteDetail.user?.username}</MDBCardText>
                              </MDBCol> */}
                            </MDBRow>
                            {/* <MDBRow>
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
                            </MDBRow> */}

                            {/* {websiteDetail.reportedWebsites && (
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
                            )} */}

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

                            {/* <MDBTypography tag="h5" className="pt-2" style={{ color: '#145DA0' }}>
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
                                {(() => {
                                  switch (websiteDetail.website?.status) {
                                    case 'deactivate':
                                      return (
                                        <Tooltip title="To Activate URL - Click Here">
                                          <MDBCardText variant="outlined" color="error">
                                            Deactivated
                                          </MDBCardText>
                                        </Tooltip>
                                      );
                                    case 'activate':
                                      return (
                                        <Tooltip title="To Deactivate URL - Click Here">
                                          <MDBCardText
                                            variant="outlined"
                                            style={{ color: 'green', borderColor: 'green' }}
                                          >
                                            Activate
                                          </MDBCardText>
                                        </Tooltip>
                                      );
                                    case 'rejected':
                                      return (
                                        <Tooltip title="This URL is rejected">
                                          <MDBCardText style={{ color: 'red' }}>Rejected</MDBCardText>
                                        </Tooltip>
                                      );
                                    default:
                                      return (
                                        <Tooltip title="This URL is not approved by admin">
                                          <MDBCardText style={{ color: 'gray' }}>Pending</MDBCardText>
                                        </Tooltip>
                                      );
                                  }
                                })()}
                              </MDBCol>
                            </MDBRow> */}

                            <MDBTypography tag="h5" className="pt-3" style={{ color: '#145DA0' }}>
                              <FontAwesomeIcon
                                icon={faImage}
                                style={{
                                  paddingRight: '5px',
                                }}
                              />
                              Image
                            </MDBTypography>
                            <hr className="" />
                            <MDBRow>
                              <MDBCol md="12" sm="12">
                                {websiteDetail.website?.image ? (
                                  <a
                                    href={`${basePath}${websiteDetail.website.image}`}
                                    target="_blank"
                                    rel="noopener noreferrer" // Helps prevent potential security issues
                                  >
                                    <img
                                      src={`${basePath}${websiteDetail.website.image}`}
                                      alt="Website"
                                      style={{ width: '50%', height: '100%' }} // Adjusted width and height
                                    />
                                  </a>
                                ) : (
                                  <div>No Image Available</div> // Placeholder for when there's no image
                                )}
                              </MDBCol>
                            </MDBRow>
                            <MDBTypography tag="h5" className="pt-3" style={{ color: '#145DA0' }}>
                              <FontAwesomeIcon
                                icon={faComment}
                                style={{
                                  paddingRight: '5px',
                                }}
                              />
                              Contact
                            </MDBTypography>
                            <hr className="" />
                            <MDBRow>
                              <MDBCol md="12" sm="12">
                                <Button
                                  variant="contained"
                                  color="primary"
                                  sx={{ marginRight: '5px' }}
                                  onClick={() => {
                                    navigate(
                                      `/user/chat/${websiteDetail.user?.user_id}?url=${encodeURIComponent(
                                        websiteDetail.website?.url
                                      )}`,
                                      {
                                        state: { website_id: websiteDetail.website?.website_id },
                                      }
                                    );
                                  }}
                                >
                                  Contact
                                </Button>
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
