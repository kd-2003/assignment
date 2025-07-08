import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMenu, FiX, FiSearch, FiPlus, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-30 bg-white shadow-md rounded-b-xl px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">DevConnect</Link>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <Link to="/projects" className="text-gray-700 hover:text-blue-600 font-medium transition">Projects</Link>
        {isAuthenticated ? (
          <>
            <Link to="/create-project" className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow">
              <FiPlus /> Create Project
            </Link>
            <Link to="/profile" className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold hover:bg-blue-50 transition shadow">
              <FiUser /> Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition shadow"
            >
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">Login</Link>
            <Link to="/register" className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition shadow">Register</Link>
          </>
        )}
      </div>
      <div className="md:hidden">
        {/* Mobile menu button (hamburger) */}
        <button
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX className="w-6 h-6 text-gray-700" /> : <FiMenu className="w-6 h-6 text-gray-700" />}
        </button>
        {isMenuOpen && (
          <div className="absolute right-4 top-16 bg-white shadow-lg rounded-xl py-4 px-6 flex flex-col gap-4 min-w-[180px] z-50">
            <Link to="/projects" className="text-gray-700 hover:text-blue-600 font-medium transition" onClick={() => setIsMenuOpen(false)}>Projects</Link>
            {isAuthenticated ? (
              <>
                <Link to="/create-project" className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow" onClick={() => setIsMenuOpen(false)}>
                  <FiPlus /> Create Project
                </Link>
                <Link to="/profile" className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold hover:bg-blue-50 transition shadow" onClick={() => setIsMenuOpen(false)}>
                  <FiUser /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition shadow"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition shadow" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 