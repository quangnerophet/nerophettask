import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { collection, onSnapshot, addDoc, updateDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { seedInitialData } from './utils/seedFirestore';
import { getStatusClass, getPriorityClass } from './utils/helpers';
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
  const [tasks, setTasks] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Seed Firestore once and subscribe to real-time updates
  useEffect(() => {
    let seeded = false;

    async function init() {
      await seedInitialData();
      seeded = true;
    }

    init();

    // Real-time listener for tasks
    const unsubTasks = onSnapshot(collection(db, 'tasks'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort by createdAt descending (newest first)
      data.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setTasks(data);
    });

    // Real-time listener for users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAppUsers(data);
      setLoading(false);
    });

    return () => {
      unsubTasks();
      unsubUsers();
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // --- Task Operations ---
  const addTask = async (newTask) => {
    await addDoc(collection(db, 'tasks'), {
      ...newTask,
      createdAt: new Date().toISOString(),
    });
  };

  const updateTask = async (id, updatedFields) => {
    await updateDoc(doc(db, 'tasks', id), updatedFields);
  };

  // --- User Operations ---
  const handleAddUser = async (newUser) => {
    const userId = `user-${Date.now()}`;
    await setDoc(doc(db, 'users', userId), { ...newUser, isActive: true });
  };

  const handleToggleUser = async (userId) => {
    const target = appUsers.find(u => u.id === userId);
    if (!target) return;
    await updateDoc(doc(db, 'users', userId), { isActive: !target.isActive });
  };

  const handleEditUser = async (userId, updatedFields) => {
    await updateDoc(doc(db, 'users', userId), updatedFields);
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, ...updatedFields }));
    }
  };

  const handlePasswordChange = async (newPassword) => {
    await updateDoc(doc(db, 'users', user.id), {
      password: newPassword,
      isFirstLogin: false,
    });
    setUser(prev => ({ ...prev, isFirstLogin: false }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, sans-serif', color: '#6C757D' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔥</div>
          <p>Đang kết nối cơ sở dữ liệu...</p>
        </div>
      </div>
    );
  }

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
