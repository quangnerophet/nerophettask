import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';
import ManageUsers from './pages/ManageUsers';
import ChangePassword from './pages/ChangePassword';
import Login from './pages/Login';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Tổ chức họp tổng kết quý 1',
      description: 'Chuẩn bị và tổ chức cuộc họp tổng kết quý 1/2026. Bao gồm: đặt địa điểm, chuẩn bị slides, mời khách, setup thiết bị.',
      assigner: 'Nguyễn Văn An',
      assignees: ['Trần Thị Bình'],
      deadline: '2026-03-31',
      status: 'Chờ xử lý',
      statusClass: 'status-pending',
      priority: 'Cao',
      priorityClass: 'priority-high',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=100&q=80'
    }
  ]);

  const [appUsers, setAppUsers] = useState([
    { id: 1, name: 'Nguyễn Văn An', username: 'admin', role: 'Quản trị viên', password: 'password123', isFirstLogin: false, isActive: true },
    { id: 2, name: 'Trần Thị Bình', username: 'manager1', role: 'Quản lý', password: 'password123', isFirstLogin: false, isActive: true },
    { id: 3, name: 'Phạm Tuấn Đức', username: 'employee1', role: 'Nhân viên', password: 'password123', isFirstLogin: false, isActive: true }
  ]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const addTask = (newTask) => {
    setTasks(prev => [{ ...newTask, id: Date.now() }, ...prev]);
  };

  const updateTask = (id, updatedFields) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, ...updatedFields } : task
    ));
  };

  const handleAddUser = (newUser) => {
    setAppUsers(prev => [...prev, { ...newUser, isActive: true }]);
  };

  const handleToggleUser = (userId) => {
    setAppUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
  };

  const handleEditUser = (userId, updatedFields) => {
    setAppUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, ...updatedFields } : u
    ));
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, ...updatedFields }));
    }
  };

  const handlePasswordChange = (newPassword) => {
    const updatedUsers = appUsers.map(u =>
      u.id === user.id ? { ...u, password: newPassword, isFirstLogin: false } : u
    );
    setAppUsers(updatedUsers);
    setUser({ ...user, isFirstLogin: false });
  };

  if (!user) {
    return <Login onLogin={handleLogin} users={appUsers} />;
  }

  if (user.isFirstLogin) {
    return <ChangePassword user={user} onPasswordChanged={handlePasswordChange} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard tasks={tasks} user={user} onUpdateTask={updateTask} />} />
          <Route path="/tasks" element={<TaskList tasks={tasks} user={user} onUpdateTask={updateTask} />} />
          <Route path="/tasks/:id" element={<TaskDetail tasks={tasks} user={user} onUpdateTask={updateTask} />} />
          <Route path="/create" element={<CreateTask onAddTask={addTask} user={user} users={appUsers} />} />
          {user.role === 'Quản trị viên' && (
            <Route path="/users" element={<ManageUsers users={appUsers} onAddUser={handleAddUser} onEditUser={handleEditUser} onToggleUser={handleToggleUser} currentUser={user} />} />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
