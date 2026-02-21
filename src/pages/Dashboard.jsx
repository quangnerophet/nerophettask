import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckCircle2, Clock, AlertCircle, ArrowRight, User2, Calendar, ChevronRight } from 'lucide-react';
import { getStatusClass, getPriorityClass } from '../utils/helpers';
import './Dashboard.css';

const Dashboard = ({ tasks, user, onUpdateTask }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('Quá hạn');

    const filteredTasks = tasks.filter(t => {
        if (user?.role === 'Quản trị viên') return true;
        if (user?.role === 'Nhân viên') return t.assignees.includes(user.name);
        if (user?.role === 'Quản lý') return true;
        return false;
    });

    const stats = [
        // ... (preserving stats array as it was or similar enough to avoid too much churn if possible, 
        // but I'll write the whole block to be safe and clean)
        {
            label: 'Tổng số Task',
            value: filteredTasks.length,
            info: user?.role === 'Nhân viên' ? 'Task giao cho bạn' : 'Task liên quan đến bạn',
            icon: <LayoutDashboard size={20} />,
            color: '#6C757D'
        },
        {
            label: 'Hoàn thành',
            value: filteredTasks.filter(t => t.status === 'Hoàn thành').length,
            info: `${filteredTasks.length > 0 ? Math.round((filteredTasks.filter(t => t.status === 'Hoàn thành').length / filteredTasks.length) * 100) : 0}% hoàn thành`,
            icon: <CheckCircle2 size={20} />,
            color: '#10B981'
        },
        {
            label: 'Đang thực hiện',
            value: filteredTasks.filter(t => t.status === 'Đang thực hiện').length,
            info: 'Task đang xử lý',
            icon: <Clock size={20} />,
            color: '#3B82F6'
        },
        {
            label: 'Chờ xử lý',
            value: filteredTasks.filter(t => t.status === 'Chờ xử lý').length,
            info: 'Task cần bắt đầu',
            icon: <AlertCircle size={20} />,
            color: '#F59E0B'
        },
    ];

    const recentTask = filteredTasks[0];

    const handleStatusChange = (e, task) => {
        if (!onUpdateTask) return;
        onUpdateTask(task.id, {
            status: e.target.value,
            statusClass: getStatusClass(e.target.value)
        });
    };

    const handlePriorityChange = (e, task) => {
        if (!onUpdateTask) return;
        onUpdateTask(task.id, {
            priority: e.target.value,
            priorityClass: getPriorityClass(e.target.value)
        });
    };

    // Deadline categories logic — exclude completed tasks
    const today = new Date().toISOString().split('T')[0];

    const categories = {
        'Quá hạn': filteredTasks.filter(t => t.deadline < today && t.status !== 'Hoàn thành'),
        'Hôm nay': filteredTasks.filter(t => t.deadline === today && t.status !== 'Hoàn thành'),
        'Sắp đến hạn': filteredTasks.filter(t => t.deadline > today && t.status !== 'Hoàn thành')
    };

    const deadlineStats = [
        { key: 'Quá hạn', count: categories['Quá hạn'].length, color: '#EF4444', icon: <AlertCircle size={18} /> },
        { key: 'Hôm nay', count: categories['Hôm nay'].length, color: '#3B82F6', icon: <Clock size={18} /> },
        { key: 'Sắp đến hạn', count: categories['Sắp đến hạn'].length, color: '#F59E0B', icon: <Calendar size={18} /> },
    ];

    const activeTasks = categories[selectedCategory] || [];

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>Xin chào, {user?.name}!</h1>
                <p>Đây là tổng quan về công việc của bạn</p>
            </header>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-header">
                            <span className="stat-label">{stat.label}</span>
                            <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-info">{stat.info}</div>
                    </div>
                ))}
            </div>

            <section className="deadline-overview-section">
                <h2 className="section-title">Theo dõi thời hạn</h2>
                <div className="deadline-stats-row">
                    {deadlineStats.map((stat, idx) => (
                        <div
                            key={idx}
                            className={`deadline-stat-pill ${selectedCategory === stat.key ? 'active' : ''}`}
                            style={{ '--accent-color': stat.color }}
                            onClick={() => setSelectedCategory(stat.key)}
                        >
                            <div className="pill-icon">{stat.icon}</div>
                            <div className="pill-content">
                                <span className="pill-count">{stat.count}</span>
                                <span className="pill-label">{stat.key}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="deadline-task-list">
                    <h3 className="category-subtitle">
                        Task {selectedCategory} ({activeTasks.length})
                    </h3>
                    {activeTasks.length > 0 ? (
                        <div className="compact-task-grid">
                            {activeTasks.slice(0, 3).map(task => (
                                <div
                                    key={task.id}
                                    className="compact-task-item"
                                    onClick={() => navigate(`/tasks/${task.id}`)}
                                >
                                    <div className="item-info">
                                        <span className="item-title">{task.title}</span>
                                        <span className="item-meta">{task.assignees.join(', ')} • {task.deadline}</span>
                                    </div>
                                    <ChevronRight size={16} color="#94A3B8" />
                                </div>
                            ))}
                            {activeTasks.length > 3 && (
                                <button className="more-tasks-btn" onClick={() => navigate('/tasks')}>
                                    Xem thêm {activeTasks.length - 3} task khác...
                                </button>
                            )}
                        </div>
                    ) : (
                        <p className="no-tasks-hint">Không có task nào trong mục {selectedCategory}.</p>
                    )}
                </div>
            </section>

            <section className="recent-tasks-section">
                <div className="section-header">
                    <h2>Task gần đây</h2>
                    <span className="task-count">{filteredTasks.length} task được cập nhật gần nhất</span>
                    <button className="view-all-btn" onClick={() => navigate('/tasks')}>
                        Xem tất cả <ArrowRight size={16} />
                    </button>
                </div>

                {recentTask ? (
                    <div
                        className="task-row card"
                        onClick={() => navigate(`/tasks/${recentTask.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="task-main-info">
                            <h3 className="task-title">{recentTask.title}</h3>
                            <div className="task-meta">
                                <div className="meta-item">
                                    <User2 size={14} />
                                    <span>Giao cho: {recentTask.assignees.join(', ')}</span>
                                </div>
                                <div className="meta-item"><Calendar size={14} /> Hạn: {recentTask.deadline}</div>
                            </div>
                        </div>
                        <div className="task-badges">
                            <select
                                className={`status-badge interactive-badge ${recentTask.statusClass}`}
                                value={recentTask.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleStatusChange(e, recentTask)}
                                title="Đổi trạng thái"
                            >
                                <option value="Chờ xử lý">Chờ xử lý</option>
                                <option value="Đang thực hiện">Đang thực hiện</option>
                                <option value="Hoàn thành">Hoàn thành</option>
                            </select>
                            <select
                                className={`priority-badge interactive-badge ${recentTask.priorityClass}`}
                                value={recentTask.priority}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handlePriorityChange(e, recentTask)}
                                title="Đổi mức độ ưu tiên"
                            >
                                <option value="Thấp">Thấp</option>
                                <option value="Trung bình">Trung bình</option>
                                <option value="Cao">Cao</option>
                            </select>
                        </div>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Chưa có task nào.</p>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
