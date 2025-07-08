import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { FiPlus, FiX } from 'react-icons/fi';

const EditProject = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/api/projects/${id}`);
      const project = response.data;
      
      setFormData({
        title: project.title || '',
        description: project.description || '',
        githubLink: project.githubLink || '',
        liveLink: project.liveLink || '',
        demoLink: project.demoLink || '',
        image: project.image || '',
        technologies: project.technologies || []
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Project not found');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

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

    setSaving(true);
    try {
      await api.put(`/projects/${id}`, formData);
      toast.success('Project updated successfully!');
      navigate(`/projects/${id}`);
    } catch (error) {
      console.error('Error updating project:', error);
      const message = error.response?.data?.message || 'Failed to update project';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Project</h1>
          <p className="text-gray-600">Update your project details</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your project title"
                required
              />
            </div>

            {/* Project Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Describe your project, what it does, and what you learned..."
                rows="6"
                required
              />
            </div>

            {/* Project Image */}
            <div className="form-group">
              <label htmlFor="image" className="form-label">
                Project Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Add a screenshot or demo image of your project
              </p>
            </div>

            {/* Technologies */}
            <div className="form-group">
              <label className="form-label">Technologies Used</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  className="form-input flex-1"
                  placeholder="e.g., React, Node.js, MongoDB"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                />
                <button
                  type="button"
                  onClick={handleAddTechnology}
                  className="btn btn-outline"
                >
                  <FiPlus />
                </button>
              </div>
              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span key={index} className="badge badge-primary flex items-center gap-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="hover:text-red-600"
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
                <label htmlFor="githubLink" className="form-label">
                  GitHub Repository
                </label>
                <input
                  type="url"
                  id="githubLink"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="liveLink" className="form-label">
                  Live Demo
                </label>
                <input
                  type="url"
                  id="liveLink"
                  name="liveLink"
                  value={formData.liveLink}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://your-app.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="demoLink" className="form-label">
                  Demo Video
                </label>
                <input
                  type="url"
                  id="demoLink"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex-1"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner"></div>
                    Updating Project...
                  </div>
                ) : (
                  'Update Project'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/projects/${id}`)}
                className="btn btn-outline"
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

export default EditProject; 