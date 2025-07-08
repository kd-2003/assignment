import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit, FiGithub, FiLinkedin, FiGlobe, FiMapPin, FiUser } from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    avatar: user?.avatar || ''
  });
  const [loading, setLoading] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProjects();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchUserProjects = async () => {
    try {
      const response = await axios.get(`/api/projects?user=${user._id}`);
      setUserProjects(response.data);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      github: user?.github || '',
      linkedin: user?.linkedin || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4 md:px-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <div className="flex items-center gap-6">
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff&size=128`} alt={user.name} className="w-24 h-24 rounded-full border border-gray-200" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-2">{user.email}</p>
              {user.bio && <p className="text-gray-700">{user.bio}</p>}
            </div>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition text-sm">
            <FiEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        {(user.website || user.github || user.linkedin) && (
          <div className="flex flex-wrap gap-4 mt-2">
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <FiGlobe /> Website
              </a>
            )}
            {user.github && (
              <a href={user.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <FiGithub /> GitHub
              </a>
            )}
            {user.linkedin && (
              <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-700">
                <FiLinkedin /> LinkedIn
              </a>
            )}
          </div>
        )}
      </div>
      {/* Edit Profile Form */}
      {isEditing && (
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-2 px-4 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div>
                <label htmlFor="location" className="block mb-1 font-medium text-gray-700">Location</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-2 px-4 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="City, Country" />
              </div>
            </div>
            <div>
              <label htmlFor="bio" className="block mb-1 font-medium text-gray-700">Bio</label>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-2 px-4 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="3" placeholder="Tell us about yourself..." />
            </div>
            <div>
              <label htmlFor="avatar" className="block mb-1 font-medium text-gray-700">Avatar URL</label>
              <input type="url" id="avatar" name="avatar" value={formData.avatar} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-2 px-4 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://example.com/avatar.jpg" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="website" className="block mb-1 font-medium text-gray-700">Website</label>
                <input type="url" id="website" name="website" value={formData.website} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-2 px-4 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://your-website.com" />
              </div>
              <div>
                <label htmlFor="github" className="block mb-1 font-medium text-gray-700">GitHub</label>
                <input type="url" id="github" name="github" value={formData.github} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-2 px-4 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://github.com/username" />
              </div>
              <div>
                <label htmlFor="linkedin" className="block mb-1 font-medium text-gray-700">LinkedIn</label>
                <input type="url" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-2 px-4 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://linkedin.com/in/username" />
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                {loading ? <><div className="spinner"></div> Saving...</> : 'Save Changes'}
              </button>
              <button type="button" onClick={handleCancel} className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* User Projects */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
          <Link to="/create-project" className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            <FiEdit /> Create New Project
          </Link>
        </div>
        {projectsLoading ? (
          <div className="flex justify-center py-8">
            <div className="spinner"></div>
          </div>
        ) : userProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col justify-between">
                {project.image && (
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{tech}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">+{project.technologies.length - 3}</span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{project.likes?.length || 0} likes</span>
                  </div>
                  <Link to={`/projects/${project._id}`} className="text-blue-600 hover:text-blue-700 font-medium">View Project →</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Start showcasing your work by creating your first project!</p>
            <Link to="/create-project" className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">Create Your First Project</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 