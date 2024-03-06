import React, { useState, useEffect } from 'react';
import axiosInstance from '../../config/AxiosInstance';

export default function Searchbar() {
  const basePath = 'https://propertymanager.cloudpress.host/api/images/get-file/';
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
      <div
        style={{
          display: 'flex',
          overflow: 'auto',
          paddingLeft: '10px',
          paddingTop: '20px',
          paddingBottom: '10px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#010ED0 transparent',
          gap: '10px',
        }}
      >
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => window.open(project.url, '_blank')}
            onKeyPress={(event) => event.key === 'Enter' && window.open(project.url, '_blank')}
            style={{
              margin: '0 10px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '0',
              outline: 'none',
            }}
          >
            <img
              src={`${basePath}${project.image}`}
              alt={project.name}
              style={{
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                borderRadius: '10px',
                maxWidth: '300px',
                maxHeight: '300px',
                width: '200px',
                height: '100px',
                transition: 'transform 0.2s',
              }}
            />
          </button>
        ))}
      </div>
    </>
  );
}
