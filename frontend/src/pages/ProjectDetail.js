import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiHeart, FiMessageCircle, FiGithub, FiExternalLink, FiEdit, FiTrash2, FiUser, FiClock } from 'react-icons/fi';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchComments();
    // eslint-disable-next-line
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Project not found');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/project/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like projects');
      return;
    }
    try {
      await axios.put(`/api/projects/${id}/like`);
      setProject(prev => ({
        ...prev,
        likes: prev.likes.includes(user._id)
          ? prev.likes.filter(id => id !== user._id)
          : [...prev.likes, user._id]
      }));
    } catch (error) {
      console.error('Error liking project:', error);
      toast.error('Failed to like project');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    setSubmittingComment(true);
    try {
      const response = await axios.post('/api/comments', {
        content: commentContent,
        projectId: id
      });
      setComments(prev => [response.data, ...prev]);
      setCommentContent('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }
  if (!project) {
    return null;
  }
  const isOwner = user && project.user._id === user._id;
  const isLiked = project.likes.includes(user?._id);
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4 md:px-8 max-w-6xl mx-auto">
      {/* Project Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <Link to="/projects" className="text-blue-600 hover:text-blue-700">← Back to Projects</Link>
          {isOwner && (
            <div className="flex gap-2 ml-auto">
              <Link to={`/edit-project/${id}`} className="inline-flex items-center gap-1 px-4 py-2 rounded-md border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition text-sm">
                <FiEdit /> Edit
              </Link>
              <button onClick={handleDeleteProject} className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm">
                <FiTrash2 /> Delete
              </button>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <img src={project.user.avatar || `https://ui-avatars.com/api/?name=${project.user.name}&background=3b82f6&color=fff`} alt={project.user.name} className="w-8 h-8 rounded-full border border-gray-200" />
            <Link to={`/users/${project.user._id}`} className="text-blue-600 hover:text-blue-700 font-medium">{project.user.name}</Link>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <FiClock />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      {/* Project Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Project Image */}
          {project.image && (
            <div className="mb-6">
              <img src={project.image} alt={project.title} className="w-full h-64 object-cover rounded-lg" />
            </div>
          )}
          {/* Project Description */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
          </div>
          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{tech}</span>
                ))}
              </div>
            </div>
          )}
          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <FiMessageCircle />
              <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
            </div>
            {/* Add Comment */}
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Share your thoughts on this project..."
                  className="w-full rounded-lg border border-gray-300 py-2 px-4 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  rows="3"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentContent.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  {submittingComment ? <><div className="spinner"></div> Posting...</> : 'Post Comment'}
                </button>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  Please <Link to="/login" className="text-blue-600 hover:text-blue-700">login</Link> to leave a comment.
                </p>
              </div>
            )}
            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <img src={comment.user.avatar || `https://ui-avatars.com/api/?name=${comment.user.name}&background=3b82f6&color=fff`} alt={comment.user.name} className="w-8 h-8 rounded-full border border-gray-200 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link to={`/users/${comment.user._id}`} className="font-medium text-gray-900 hover:text-blue-600">{comment.user.name}</Link>
                        <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                      {user && comment.user._id === user._id && (
                        <button onClick={() => handleDeleteComment(comment._id)} className="text-red-600 hover:text-red-700 text-sm mt-2">Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'}`}
              >
                <FiHeart className={isLiked ? 'fill-current' : ''} />
                <span>{project.likes.length} {project.likes.length === 1 ? 'like' : 'likes'}</span>
              </button>
            </div>
            {/* Project Links */}
            <div className="space-y-2">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 w-full px-4 py-2 rounded-md border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition">
                  <FiGithub /> View Code
                </a>
              )}
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                  <FiExternalLink /> View Live
                </a>
              )}
              {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 w-full px-4 py-2 rounded-md border border-purple-600 text-purple-600 font-medium hover:bg-purple-50 transition">
                  <FiExternalLink /> Watch Demo
                </a>
              )}
            </div>
          </div>
          {/* Author Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">About the Author</h3>
            <div className="flex items-center gap-3 mb-4">
              <img src={project.user.avatar || `https://ui-avatars.com/api/?name=${project.user.name}&background=3b82f6&color=fff`} alt={project.user.name} className="w-12 h-12 rounded-full border border-gray-200" />
              <div>
                <Link to={`/users/${project.user._id}`} className="font-medium text-gray-900 hover:text-blue-600">{project.user.name}</Link>
                {project.user.bio && <p className="text-sm text-gray-600">{project.user.bio}</p>}
              </div>
            </div>
            <Link to={`/users/${project.user._id}`} className="inline-block w-full text-center px-4 py-2 rounded-md border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition">View Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 