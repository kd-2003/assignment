import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiGithub, FiExternalLink, FiEye, FiHeart, FiMessageCircle, FiUser } from 'react-icons/fi';

const Home = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentProjects();
  }, []);

  const fetchRecentProjects = async () => {
    try {
      const response = await axios.get('/api/projects?limit=6');
      setRecentProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16 px-4 rounded-b-3xl shadow-lg mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Connect with Developers</h1>
          <p className="text-lg md:text-xl mb-8 font-medium">Showcase your projects, discover amazing developers, and get valuable feedback from the community.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects" className="px-8 py-3 rounded-lg bg-white text-blue-700 font-bold shadow hover:bg-blue-100 transition text-lg">Explore Projects</Link>
            <Link to="/register" className="px-8 py-3 rounded-lg border-2 border-white text-white font-bold hover:bg-blue-600 transition text-lg">Join DevConnect</Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4">
            <FiUser className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Showcase Projects</h3>
          <p className="text-gray-600">Share your best work with the developer community and get inspired by others.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4">
            <FiMessageCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Get Feedback</h3>
          <p className="text-gray-600">Receive valuable comments and suggestions to improve your projects.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <div className="bg-purple-100 text-purple-600 rounded-full p-4 mb-4">
            <FiEye className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Discover Talent</h3>
          <p className="text-gray-600">Find amazing developers and connect with like-minded professionals.</p>
        </div>
      </section>
      {/* Recent Projects Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
          <Link to="/projects" className="text-blue-600 hover:underline font-medium">View All →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => (
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
                  <div className="flex items-center gap-2">
                    <img src={project.user.avatar || `https://ui-avatars.com/api/?name=${project.user.name}&background=3b82f6&color=fff`} alt={project.user.name} className="w-6 h-6 rounded-full border border-gray-200" />
                    <span className="text-sm text-gray-600">{project.user.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiHeart />
                      <span>{project.likes?.length || 0}</span>
                    </div>
                    <Link to={`/projects/${project._id}`} className="text-blue-600 hover:text-blue-700">View →</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects yet. Be the first to share your work!</p>
              <Link to="/create-project" className="mt-4 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">Create Your First Project</Link>
            </div>
          )}
        </div>
      </section>
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-xl shadow p-10">
        <h2 className="text-3xl font-bold mb-4">Ready to Showcase Your Work?</h2>
        <p className="text-xl mb-6 opacity-90">Join thousands of developers who are already sharing their projects and getting feedback.</p>
        <Link to="/register" className="inline-block px-8 py-3 rounded-lg bg-white text-blue-600 font-semibold text-lg hover:bg-gray-100 transition">Get Started Today</Link>
      </div>
    </div>
  );
};

export default Home; 