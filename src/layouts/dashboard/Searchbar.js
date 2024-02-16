import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';
import axiosInstance from '../../config/AxiosInstance';

const SearchbarStyle = styled('div')(({ theme }) => ({
  display: 'contents',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default function Searchbar() {
  const basePath = 'https://propertymanager.cloudpress.host/api/images/upload/images/';
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/projects/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <SearchbarStyle>
        {projects.map((project) => (
          <button
            key={project.id}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex' }}
            onClick={() => window.open(project.url, '_blank')} // Use project.url here
            onKeyPress={(event) => event.key === 'Enter' && window.open(project.url, '_blank')} // And here
          >
            <img
              src={`${basePath}${project.image}`}
              alt={project.name}
              style={{ width: '100px', height: '70px', objectFit: 'contain' }}
            />
          </button>
        ))}
      </SearchbarStyle>
    </>
  );
}
