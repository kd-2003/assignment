import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FiSearch, FiHeart, FiEye, FiGithub, FiExternalLink } from 'react-icons/fi';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, [searchQuery, filter, currentPage]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filter !== 'all') params.append('user', filter);
      params.append('page', currentPage);
      params.append('limit', 12);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects?${params}`);
      if (currentPage === 1) {
        setProjects(response.data);
      } else {
        setProjects(prev => [...prev, ...response.data]);
      }
      setHasMore(response.data.length === 12);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProjects();
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleLike = async (projectId) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${projectId}/like`);
      setProjects(prev =>
        prev.map(project =>
          project._id === projectId
            ? {
                ...project,
                likes: project.likes.includes(user?._id)
                  ? project.likes.filter(id => id !== user._id)
                  : [...project.likes, user._id],
              }
            : project
        )
      );
    } catch (error) {
      console.error('Error liking project:', error);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Projects</h1>
        <p className="text-gray-600">Discover amazing projects from developers around the world</p>
      </div>
      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-end">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-gray-50 placeholder-gray-400"
            />
          </div>
        </form>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-gray-300 py-2 px-4 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent md:w-48"
        >
          <option value="all">All Projects</option>
          <option value="recent">Recent</option>
          <option value="popular">Most Liked</option>
        </select>
      </div>
      {/* Projects Grid */}
      {projects.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {projects.map((project) => (
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
                <div className="flex items-center justify-between mb-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <img src={project.user.avatar || `https://ui-avatars.com/api/?name=${project.user.name}&background=3b82f6&color=fff`} alt={project.user.name} className="w-6 h-6 rounded-full border border-gray-200" />
                    <span className="text-sm text-gray-600">{project.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <button
                      onClick={() => handleLike(project._id)}
                      className={`flex items-center gap-1 hover:text-red-500 transition ${project.likes?.includes(user?._id) ? 'text-red-500' : ''}`}
                    >
                      <FiHeart />
                      <span>{project.likes?.length || 0}</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition text-xs"
                    >
                      <FiGithub /> Code
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-green-600 text-green-600 font-medium hover:bg-green-50 transition text-xs"
                    >
                      <FiExternalLink /> Live
                    </a>
                  )}
                  <Link
                    to={`/projects/${project._id}`}
                    className="ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-xs"
                  >
                    <FiEye /> View
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {/* Load More */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition text-base"
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Loading...
                  </>
                ) : (
                  'Load More Projects'
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiSearch size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? `No projects match "${searchQuery}". Try adjusting your search.`
              : 'No projects have been shared yet. Be the first to share your work!'}
          </p>
          {!searchQuery && (
            <Link to="/create-project" className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">Create Your First Project</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects; 