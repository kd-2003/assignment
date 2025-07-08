import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiGithub, FiLinkedin, FiGlobe, FiMapPin, FiFolder } from 'react-icons/fi';

const UserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${id}`);
      setUserData(response.data.user);
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
        <p className="text-gray-600">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* User Header */}
        <div className="card mb-8">
          <div className="flex items-start gap-6">
            <img 
              src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=3b82f6&color=fff&size=128`} 
              alt={userData.name}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{userData.name}</h1>
              {userData.location && (
                <p className="text-gray-600 mb-2 flex items-center gap-1">
                  <FiMapPin />
                  {userData.location}
                </p>
              )}
              {userData.bio && (
                <p className="text-gray-700 mb-4">{userData.bio}</p>
              )}
              
              {/* Social Links */}
              {(userData.website || userData.github || userData.linkedin) && (
                <div className="flex gap-4">
                  {userData.website && (
                    <a
                      href={userData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                      <FiGlobe />
                      Website
                    </a>
                  )}
                  {userData.github && (
                    <a
                      href={userData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                      <FiGithub />
                      GitHub
                    </a>
                  )}
                  {userData.linkedin && (
                    <a
                      href={userData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-700"
                    >
                      <FiLinkedin />
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Projects */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiFolder />
            Projects ({projects.length})
          </h2>

          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project._id} className="card hover:shadow-lg transition-shadow">
                  {project.image && (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span key={index} className="badge badge-primary">{tech}</span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="badge">+{project.technologies.length - 3}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{project.likes?.length || 0} likes</span>
                    </div>
                    <a 
                      href={`/projects/${project._id}`} 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Project →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFolder size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600">
                {userData.name} hasn't shared any projects yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 