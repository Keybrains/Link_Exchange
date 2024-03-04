import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMoneyBill, faCircleInfo, faLink, faImage, faComment } from '@fortawesome/free-solid-svg-icons';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import CircularProgress from '@mui/material/CircularProgress';
import { OpenImageDialog } from './OpenImageDialog';
import Page from '../components/Page';
import axiosInstance from '../config/AxiosInstance';

export default function UserWebsiteDetail() {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const [websiteDetail, setWebsiteDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const basePath = 'https://propertymanager.cloudpress.host/api/images/get-file/';
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
  }, [websiteId]);

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
                            </MDBRow>

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
                                <MDBCardText className="text-muted">{websiteDetail.website?.monthlyVisits}</MDBCardText>
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
                                  Categories :
                                </MDBTypography>
                                <MDBCardText className="text-muted">
                                  {websiteDetail.website?.categories.join(', ')}
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
                                ) : (
                                  <div>No Image Available</div>
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
          <OpenImageDialog open={open} setOpen={setOpen} selectedImage={selectedImage} />
        </>
      )}
    </Page>
  );
}
