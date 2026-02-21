import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, PlusCircle, LogOut, Users, X } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ user, onLogout, isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <div className="logo-text">
            <h1>Nero Phết</h1>
            <span>Quản lý Tasks</span>
          </div>
        </div>
        {/* Close button on mobile */}
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Đóng menu">
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav" onClick={onClose}>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} />
          <span>Tổng quan</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <ListTodo size={20} />
          <span>Danh sách Task</span>
        </NavLink>
        {user?.role !== 'Nhân viên' && (
          <NavLink to="/create" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <PlusCircle size={20} />
            <span>Tạo Task</span>
          </NavLink>
        )}
        {user?.role === 'Quản trị viên' && (
          <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Users size={20} />
            <span>Quản lý Nhân sự</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role-badge">{user?.role}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
