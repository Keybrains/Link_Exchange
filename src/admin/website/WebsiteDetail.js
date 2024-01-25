import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { styled } from '@mui/system';
import { faUser, faMoneyBill, faBarsProgress, faCircleInfo, faLink, faBug } from '@fortawesome/free-solid-svg-icons';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import CircularProgress from '@mui/material/CircularProgress';
import Page from '../components/Page';
import axiosInstance from '../config/AxiosInstanceAdmin';

// const IconWrapper = styled('span')({
//   marginRight: '8px',
//   fontSize: '20px',
// });

export default function WebsiteDetail() {
  const { websiteId } = useParams();
  const [websiteDetail, setWebsiteDetail] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchWebsiteDetail = async (websiteId) => {
    try {
      const response = await axiosInstance.get(`/website/websitesdetail?website_id=${websiteId}`);
      if (response.data && response.data.success) {
        setWebsiteDetail(response.data.data); // Assuming "website" is the key for website details

        setLoading(false);
      } else {
        console.error('No data found in response:', response);
        setLoading(false);

        // Handle other cases if needed (e.g., error messages)
      }
    } catch (error) {
      console.error('Error fetching website details:', error);
      setLoading(false);

      // Handle error state if needed
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
                        {/* <MDBCol
                      md="4"
                      className="gradient-custom text-center text-white d-flex flex-column justify-content-center align-items-center"
                      style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{
                          fontSize: '3em', // Adjust the size as needed
                          marginBottom: '25px',
                          marginTop: '25px',
                        }}
                      />

                      <MDBTypography tag="h6">
                        {websiteDetail.url} {websiteDetail.lastname}
                      </MDBTypography>
                      <MDBCardText>{websiteDetail.username}</MDBCardText>
                      <MDBIcon far icon="edit mb-5" />
                    </MDBCol> */}

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
                                {/* <MDBTypography tag="h6">Email</MDBTypography> */}
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
                                {/* <MDBTypography tag="h6">Email</MDBTypography> */}
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
