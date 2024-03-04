import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMoneyBill,
  faBarsProgress,
  faCircleInfo,
  faLink,
  faBug,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import CircularProgress from '@mui/material/CircularProgress';
import { PhotoCamera } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import Page from '../components/Page';
import { OpenImageDialog } from '../../OtherUserWebsite/OpenImageDialog';
import axiosInstance from '../config/AxiosInstanceAdmin';

export default function WebsiteDetail() {
  const { websiteId } = useParams();
  const [websiteDetail, setWebsiteDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleOpenDialog = (image) => {
    setSelectedImage(`${basePath}${image}`);
    setOpen(true);
  };

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

  useEffect(() => {
    fetchWebsiteDetail(websiteId);
  }, [websiteId, fileName]);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);

    await handleUpload(selectedFile);
  };

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

      await axiosInstance.put(`/website/websites/${websiteId}`, {
        image: imageName,
      });
      setFileName('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  const basePath = 'https://propertymanager.cloudpress.host/api/images/get-file/';

  const handleDeleteImage = async () => {
    try {
      const response = await axiosInstance.delete(`/website/websites/remove-image/${websiteId}`);
      if (response.data.success) {
        setWebsiteDetail((prevDetails) => ({
          ...prevDetails,
          website: {
            ...prevDetails.website,
            image: '',
          },
        }));
        setTimeout(() => {
          fetchWebsiteDetail(websiteId);
        }, 1000);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
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
                                {(() => {
                                  switch (websiteDetail.website?.status) {
                                    case 'deactivate':
                                      return (
                                        <MDBCardText variant="outlined" color="error">
                                          Deactivated
                                        </MDBCardText>
                                      );
                                    case 'activate':
                                      return (
                                        <MDBCardText
                                          variant="outlined"
                                          style={{ color: 'green', borderColor: 'green' }}
                                        >
                                          Activate
                                        </MDBCardText>
                                      );
                                    case 'rejected':
                                      return <MDBCardText style={{ color: 'red' }}>Rejected</MDBCardText>;
                                    default:
                                      return <MDBCardText style={{ color: 'gray' }}>Pending</MDBCardText>;
                                  }
                                })()}
                              </MDBCol>
                            </MDBRow>

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
                                <Stack
                                  direction={{ xs: 'column', sm: 'row' }}
                                  spacing={2}
                                  alignItems="center"
                                  justifyContent="flex-start"
                                >
                                  <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth={{ xs: true, sm: false }}
                                    sx={{
                                      margin: '0px 0',
                                      borderColor: 'action.active',
                                      width: { sm: 'auto' },
                                    }}
                                  >
                                    <PhotoCamera sx={{ ml: 0 }} />
                                    Image
                                    <input type="file" hidden onChange={handleFileChange} />
                                  </Button>
                                  {websiteDetail.website?.image && (
                                    <Button
                                      color="error"
                                      variant="outlined"
                                      onClick={handleDeleteImage}
                                      fullWidth={{ xs: true, sm: false }}
                                      sx={{
                                        margin: '0px 0',
                                        borderColor: 'action.active',
                                        width: { sm: 'auto' },
                                      }}
                                    >
                                      <DeleteIcon sx={{ ml: 0 }} />
                                    </Button>
                                  )}
                                  {fileName && (
                                    <div>
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                        style={{ width: '50%', height: 'auto' }}
                                      />
                                    </div>
                                  )}
                                  {!fileName && websiteDetail.website?.image && (
                                    <button
                                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                      onClick={() => handleOpenDialog(websiteDetail.website.image)}
                                      title="View Image"
                                    >
                                      <img
                                        src={`${basePath}${websiteDetail.website.image}`}
                                        alt="Website"
                                        style={{ width: '50%', height: '100%' }}
                                      />
                                    </button>
                                  )}
                                  {!websiteDetail.website?.image && !fileName && <div>No Image Available</div>}
                                </Stack>
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
          <OpenImageDialog open={open} setOpen={setOpen} selectedImage={selectedImage} />
        </>
      )}
    </Page>
  );
}
