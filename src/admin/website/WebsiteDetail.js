import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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

import 'bootstrap/dist/css/bootstrap.min.css';
import Page from '../components/Page';
import axiosInstance from '../config/AxiosInstanceAdmin';

const IconWrapper = styled('span')({
  marginRight: '8px',
  fontSize: '20px',
});

export default function WebsiteDetail() {
  const location = useLocation();
  const [websiteDetail, setWebsiteDetail] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const websiteId = searchParams.get('websiteId');

    const fetchWebsiteDetail = async (id) => {
      try {
        const response = await axiosInstance.get(`/website/websites?websiteId=${id}`);
        setWebsiteDetail(response.data.data);
        console.log(response.data.data, '-------------');
      } catch (error) {
        console.error('Error fetching website details:', error);
      }
    };

    if (websiteId) {
      fetchWebsiteDetail(websiteId);
    }
  }, [location.search]);

  return (
    <Page title="User Detail">
      {websiteDetail && (
        <div>
          <h1>{websiteDetail.url}</h1>
          <p>{websiteDetail.username}</p>

          {/* Mapping over 'categories' array and rendering them */}
          <ul>
            {websiteDetail.categories.map((category, index) => (
              <li key={index}>{category}</li>
            ))}
          </ul>

          {/* Mapping over other data arrays/objects */}
          {/* Add your mapping logic here */}
        </div>
      )}
    </Page>
  );
}
