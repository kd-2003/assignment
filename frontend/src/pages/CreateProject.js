import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { FiPlus, FiX } from 'react-icons/fi';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    liveLink: '',
    demoLink: '',
    image: '',
    technologies: []
  });
  const [newTechnology, setNewTechnology] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTechnology.trim()]
      });
      setNewTechnology('');
    }
  };

  const handleRemoveTechnology = (techToRemove) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(tech => tech !== techToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/projects', formData);
      toast.success('Project created successfully!');
      navigate(`/projects/${response.data._id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      const message = error.response?.data?.message || 'Failed to create project';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2 drop-shadow">Create New Project</h1>
          <p className="text-gray-600 text-lg">Share your amazing work with the developer community</p>
        </div>

        <div className="card bg-white shadow-2xl rounded-2xl p-8 border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label text-lg font-semibold text-gray-800">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input mt-1 px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full"
                placeholder="Enter your project title"
                required
              />
            </div>

            {/* Project Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label text-lg font-semibold text-gray-800">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea mt-1 px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full"
                placeholder="Describe your project, what it does, and what you learned..."
                rows="6"
                required
              />
            </div>

            {/* Project Image */}
            <div className="form-group">
              <label htmlFor="image" className="form-label text-lg font-semibold text-gray-800">
                Project Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="form-input mt-1 px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Add a screenshot or demo image of your project
              </p>
            </div>

            {/* Technologies */}
            <div className="form-group">
              <label className="form-label text-lg font-semibold text-gray-800">Technologies Used</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  className="form-input flex-1 px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="e.g., React, Node.js, MongoDB"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                />
                <button
                  type="button"
                  onClick={handleAddTechnology}
                  className="btn btn-outline border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-lg px-3 py-2 transition flex items-center"
                >
                  <FiPlus />
                </button>
              </div>
              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span key={index} className="badge badge-primary flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow">
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="hover:text-red-600 ml-1"
                      >
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Project Links */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="form-group">
                <label htmlFor="githubLink" className="form-label text-gray-700 font-medium">
                  GitHub Repository
                </label>
                <input
                  type="url"
                  id="githubLink"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  className="form-input mt-1 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="liveLink" className="form-label text-gray-700 font-medium">
                  Live Demo
                </label>
                <input
                  type="url"
                  id="liveLink"
                  name="liveLink"
                  value={formData.liveLink}
                  onChange={handleChange}
                  className="form-input mt-1 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full"
                  placeholder="https://your-app.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="demoLink" className="form-label text-gray-700 font-medium">
                  Demo Video
                </label>
                <input
                  type="url"
                  id="demoLink"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleChange}
                  className="form-input mt-1 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner"></div>
                    Creating Project...
                  </div>
                ) : (
                  <><FiPlus /> Create Project</>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="btn btn-outline border-2 border-gray-400 text-gray-700 hover:bg-gray-100 rounded-lg px-6 py-3 font-semibold transition shadow"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject; 