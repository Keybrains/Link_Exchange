import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Page from '../components/Page';
import axiosInstance from '../config/AxiosInstanceAdmin';

const IconWrapper = styled('span')({
  marginRight: '8px',
  fontSize: '20px',
});

export default function UserDetail() {
  const { userId } = useParams();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axiosInstance.get(`/signup/users/${userId}`);
        setUserDetail(response.data.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetail();
  }, [userId]);

  return (
    <Page title="User Detail">
      <Typography variant="h4" gutterBottom style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
        {/* User Detail */}
      </Typography>
      {/* {userDetail && (
        <Card style={{ padding: '30px' }}>
          <FontAwesomeIcon
            icon={faDotCircle}
            style={{
              color: userDetail.status === 'activate' ? 'green' : 'red',
              fontSize: '0.9em', // Adjust the size as needed
              marginRight: '5px',
              marginLeft: '15px',
            }}
          />
          <span style={{ color: userDetail.status === 'activate' ? 'green' : 'red' }}>
            {userDetail.status === 'activate' ? 'activate' : 'deactivate'}
          </span>

          <TableContainer component={Paper}>
            <Table aria-label="user details table">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <IconWrapper>
                      <FontAwesomeIcon icon={faUser} />
                    </IconWrapper>
                    Name:
                  </TableCell>
                  <TableCell>
                    {userDetail.firstname} {userDetail.lastname}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <IconWrapper>
                      <FontAwesomeIcon icon={faBuilding} />
                    </IconWrapper>
                    Company Name:
                  </TableCell>
                  <TableCell>{userDetail.companyname}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <IconWrapper>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </IconWrapper>
                    Email:
                  </TableCell>
                  <TableCell>{userDetail.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <IconWrapper>
                      <FontAwesomeIcon icon={faPhone} />
                    </IconWrapper>
                    Phone Number:
                  </TableCell>
                  <TableCell>{userDetail.phonenumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <IconWrapper>
                      <FontAwesomeIcon icon={faUserCircle} />
                    </IconWrapper>
                    Username:
                  </TableCell>
                  <TableCell>{userDetail.username}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )} */}
      {userDetail && (
        <section className="">
          <MDBContainer className="py-5 h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol lg="7" className="mb-2 mb-lg-0">
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
                          fontSize: '3em', // Adjust the size as needed
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
                                fontSize: '0.9em', // Adjust the size as needed
                                marginRight: '5px',
                                // marginLeft: '15px',
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
    </Page>
  );
}
