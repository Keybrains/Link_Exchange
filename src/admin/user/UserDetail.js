import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@mui/system';
import { faUser, faDotCircle } from '@fortawesome/free-solid-svg-icons';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBTypography,
  MDBIcon,
} from 'mdb-react-ui-kit';
import './style.css';
import CircularProgress from '@mui/material/CircularProgress';
import Page from '../components/Page';
import axiosInstance from '../config/AxiosInstanceAdmin';

const IconWrapper = styled('span')({
  marginRight: '8px',
  fontSize: '20px',
});

export default function UserDetail() {
  const { userId } = useParams();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);

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
                            <MDBTypography tag="h6">User Detail</MDBTypography>
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

                            <MDBTypography tag="h6">Status</MDBTypography>
                            <hr className="" />
                            <MDBRow className="">
                              <MDBCol size="6" className="">
                                <FontAwesomeIcon
                                  icon={faDotCircle}
                                  style={{
                                    color: userDetail.status === 'activate' ? 'green' : 'red',
                                    fontSize: '0.9em',
                                    marginRight: '5px',
                                  }}
                                />
                                <span style={{ color: userDetail.status === 'activate' ? 'green' : 'red' }}>
                                  {userDetail.status === 'activate' ? 'Activate' : 'Deactivate'}
                                </span>
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
