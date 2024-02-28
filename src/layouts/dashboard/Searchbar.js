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
      <div className="imagebtn" style={{ display: 'flex', overflow: 'auto' }}>
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => window.open(project.url, '_blank')}
            onKeyPress={(event) => event.key === 'Enter' && window.open(project.url, '_blank')}
          >
            <img
              src={`${basePath}${project.image}`}
              alt={project.name}
              style={{ display: 'block', maxWidth: '130px' }}
            />
          </button>
        ))}
      </div>
    </>
  );
}
