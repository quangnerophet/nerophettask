import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, User2, Calendar, ArrowUpDown } from 'lucide-react';
import { getStatusClass, getPriorityClass } from '../utils/helpers';
import './TaskList.css';

const today = new Date().toISOString().split('T')[0];

const getDeadlineStyle = (task) => {
    if (task.status === 'Hoàn thành') return {};
    if (task.deadline < today) return { color: '#EF4444', fontWeight: 600 };
    if (task.deadline === today) return { color: '#F59E0B', fontWeight: 600 };
    return {};
};

const TaskList = ({ tasks, user, onUpdateTask }) => {
    const navigate = useNavigate();

    // Local State for Filters and Tabs
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
    const [priorityFilter, setPriorityFilter] = useState('Tất cả mức độ');
    const [sortOption, setSortOption] = useState('Mới nhất');
    const [activeTab, setActiveTab] = useState('Tất cả');

    // Filter and Sort Logic
    const processedTasks = useMemo(() => {
        // First, apply base visibility
        let result = tasks.filter(t => {
            if (user?.role === 'Quản trị viên') return true;
            if (user?.role === 'Nhân viên') return t.assignees.includes(user.name);
            if (user?.role === 'Quản lý') return true; // Supervisor sees all for now
            return false;
        });

        // 1. Tab Filter
        if (activeTab === 'Được giao') {
            result = result.filter(task => task.assignees.includes(user?.name));
        } else if (activeTab === 'Đã giao') {
            result = result.filter(task => task.assigner === user?.name);
        }

        // 2. Search Filter
        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(task =>
                task.title.toLowerCase().includes(lowerQuery) ||
                task.description.toLowerCase().includes(lowerQuery)
            );
        }

        // 3. Status Filter
        if (statusFilter !== 'Tất cả trạng thái') {
            result = result.filter(task => task.status === statusFilter);
        }

        // 4. Priority Filter
        if (priorityFilter !== 'Tất cả mức độ') {
            result = result.filter(task => task.priority === priorityFilter);
        }

        // 5. Sorting
        result.sort((a, b) => {
            // Completed tasks always go to the bottom
            if (a.status === 'Hoàn thành' && b.status !== 'Hoàn thành') return 1;
            if (b.status === 'Hoàn thành' && a.status !== 'Hoàn thành') return -1;
            if (sortOption === 'Mới nhất') {
                return (b.createdAt || '').localeCompare(a.createdAt || '');
            } else if (sortOption === 'Cũ nhất') {
                return (a.createdAt || '').localeCompare(b.createdAt || '');
            } else if (sortOption === 'Đến hạn sớm nhất') {
                return new Date(a.deadline) - new Date(b.deadline);
            }
            return 0;
        });

        return result;
    }, [tasks, user, activeTab, searchQuery, statusFilter, priorityFilter, sortOption]);

    // Handlers
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

    return (
        <div className="task-list-page">
            <header className="page-header-row">
                <div className="page-title">
                    <h1>Danh sách Task</h1>
                    <p>Quản lý và theo dõi tất cả công việc</p>
                </div>
                {user?.role !== 'Nhân viên' && (
                    <button className="create-task-btn" onClick={() => navigate('/create')}>
                        <Plus size={16} />
                        <span>Tạo Task mới</span>
                    </button>
                )}
            </header>

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} color="#A1A1AA" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm task..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <div className="filter-select">
                        <Filter size={16} color="#A1A1AA" />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="Tất cả trạng thái">Tất cả trạng thái</option>
                            <option value="Chờ xử lý">Chờ xử lý</option>
                            <option value="Đang thực hiện">Đang thực hiện</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                        </select>
                    </div>
                    <div className="filter-select">
                        <Filter size={16} color="#A1A1AA" />
                        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                            <option value="Tất cả mức độ">Tất cả mức độ</option>
                            <option value="Thấp">Thấp</option>
                            <option value="Trung bình">Trung bình</option>
                            <option value="Cao">Cao</option>
                        </select>
                    </div>
                    <div className="filter-select sort-select">
                        <ArrowUpDown size={16} color="#A1A1AA" />
                        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="Mới nhất">Mới nhất</option>
                            <option value="Cũ nhất">Cũ nhất</option>
                            <option value="Đến hạn sớm nhất">Đến hạn sớm nhất</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="tabs-bar">
                {['Tất cả', 'Được giao', 'Đã giao'].map(tab => (
                    <button
                        key={tab}
                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="tasks-container">
                {processedTasks.length > 0 ? (
                    processedTasks.map((task, index) => {
                        const isCompleted = task.status === 'Hoàn thành';
                        const deadlineStyle = getDeadlineStyle(task);
                        return (
                            <div
                                key={task.id || index}
                                className={`task-card ${isCompleted ? 'task-completed' : ''}`}
                                onClick={() => navigate(`/tasks/${task.id}`)}
                                style={{ cursor: 'pointer', opacity: isCompleted ? 0.5 : 1 }}
                            >
                                <div className="task-card-main">
                                    <div className="task-header-with-badges">
                                        <h3 className={`task-title ${isCompleted ? 'task-title-done' : ''}`}>{task.title}</h3>
                                        <div className="task-card-badges">
                                            <select
                                                className={`status-badge interactive-badge ${task.statusClass}`}
                                                value={task.status}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => handleStatusChange(e, task)}
                                                title="Đổi trạng thái"
                                            >
                                                <option value="Chờ xử lý">Chờ xử lý</option>
                                                <option value="Đang thực hiện">Đang thực hiện</option>
                                                <option value="Hoàn thành">Hoàn thành</option>
                                            </select>
                                            <select
                                                className={`priority-badge interactive-badge ${task.priorityClass}`}
                                                value={task.priority}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => handlePriorityChange(e, task)}
                                                title="Đổi mức độ ưu tiên"
                                            >
                                                <option value="Thấp">Thấp</option>
                                                <option value="Trung bình">Trung bình</option>
                                                <option value="Cao">Cao</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p className="task-desc">{task.description}</p>
                                    <div className="task-meta-grid">
                                        <div className="meta-item"><User2 size={14} /> Giao: {task.assigner}</div>
                                        <div className="meta-item">
                                            <User2 size={14} />
                                            <span>Nhận: {task.assignees?.join(', ')}</span>
                                        </div>
                                        <div className="meta-item" style={deadlineStyle}>
                                            <Calendar size={14} />
                                            Hạn: {task.deadline}
                                            {deadlineStyle.color === '#EF4444' && ' ⚠'}
                                            {deadlineStyle.color === '#F59E0B' && ' ⏰'}
                                        </div>
                                    </div>
                                    {task.image && (
                                        <div className="task-attachment">
                                            <img src={task.image} alt="Task attachment" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
                        Không có task nào phù hợp với bộ lọc hiện tại.
                    </p>
                )}
            </div>
        </div>
    );
};

export default TaskList;
