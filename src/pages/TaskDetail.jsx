import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User2, Calendar, Edit, X, Save } from 'lucide-react';
import { getStatusClass, getPriorityClass } from '../utils/helpers';
import './TaskDetail.css';

const today = new Date().toISOString().split('T')[0];

const TaskDetail = ({ tasks, user, onUpdateTask }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    const task = tasks.find(t => t.id.toString() === id);

    if (!task) {
        return (
            <div className="task-detail-error">
                <h2>Không tìm thấy Task</h2>
                <p>Task này có thể đã bị xóa hoặc không tồn tại.</p>
                <button className="back-btn" onClick={() => navigate('/tasks')}>
                    <ArrowLeft size={16} /> Quay lại danh sách
                </button>
            </div>
        );
    }

    const handleStatusChange = (e) => {
        if (!onUpdateTask) return;
        onUpdateTask(task.id, {
            status: e.target.value,
            statusClass: getStatusClass(e.target.value)
        });
    };

    const handlePriorityChange = (e) => {
        if (!onUpdateTask) return;
        onUpdateTask(task.id, {
            priority: e.target.value,
            priorityClass: getPriorityClass(e.target.value)
        });
    };

    const startEdit = () => {
        setEditData({
            title: task.title,
            description: task.description,
            deadline: task.deadline,
        });
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditData({});
    };

    const saveEdit = () => {
        if (!editData.title?.trim()) return;
        onUpdateTask(task.id, {
            title: editData.title,
            description: editData.description,
            deadline: editData.deadline,
        });
        setIsEditing(false);
    };

    // Deadline color logic
    const getDeadlineColor = () => {
        if (task.status === 'Hoàn thành') return {};
        if (task.deadline < today) return { color: '#EF4444', fontWeight: 600 };
        if (task.deadline === today) return { color: '#F59E0B', fontWeight: 600 };
        return {};
    };

    return (
        <div className="task-detail-page">
            <header className="detail-header-actions">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                    <span>Quay lại</span>
                </button>
                <div className="detail-header-buttons">
                    {!isEditing ? (
                        <button className="edit-btn" onClick={startEdit}>
                            <Edit size={16} /> Chỉnh sửa
                        </button>
                    ) : (
                        <>
                            <button className="cancel-edit-btn" onClick={cancelEdit}>
                                <X size={16} /> Hủy
                            </button>
                            <button className="save-edit-btn" onClick={saveEdit}>
                                <Save size={16} /> Lưu
                            </button>
                        </>
                    )}
                </div>
            </header>

            <div className="task-detail-content card">
                <div className="detail-title-row">
                    {isEditing ? (
                        <input
                            className="edit-input title-input"
                            value={editData.title}
                            onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                            placeholder="Tên task"
                        />
                    ) : (
                        <h1>{task.title}</h1>
                    )}
                    <div className="detail-badges">
                        <select
                            className={`status-badge interactive-badge ${task.statusClass}`}
                            value={task.status}
                            onChange={handleStatusChange}
                            title="Đổi trạng thái"
                        >
                            <option value="Chờ xử lý">Chờ xử lý</option>
                            <option value="Đang thực hiện">Đang thực hiện</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                        </select>
                        <select
                            className={`priority-badge interactive-badge ${task.priorityClass}`}
                            value={task.priority}
                            onChange={handlePriorityChange}
                            title="Đổi mức độ ưu tiên"
                        >
                            <option value="Thấp">Thấp</option>
                            <option value="Trung bình">Trung bình</option>
                            <option value="Cao">Cao</option>
                        </select>
                    </div>
                </div>

                <div className="detail-meta-section">
                    <div className="meta-card">
                        <User2 size={16} color="#64748B" />
                        <div className="meta-text">
                            <span className="meta-label">Người giao</span>
                            <span className="meta-value">{task.assigner}</span>
                        </div>
                    </div>
                    <div className="meta-card">
                        <User2 size={16} color="#64748B" />
                        <div className="meta-text">
                            <span className="meta-label">Người nhận</span>
                            <span className="meta-value">{task.assignees?.join(', ')}</span>
                        </div>
                    </div>
                    <div className="meta-card">
                        <Calendar size={16} color="#64748B" />
                        <div className="meta-text">
                            <span className="meta-label">Thời hạn</span>
                            {isEditing ? (
                                <input
                                    type="date"
                                    className="edit-input"
                                    value={editData.deadline}
                                    onChange={e => setEditData(d => ({ ...d, deadline: e.target.value }))}
                                />
                            ) : (
                                <span className="meta-value" style={getDeadlineColor()}>
                                    {task.deadline}
                                    {task.deadline < today && task.status !== 'Hoàn thành' && ' ⚠ Quá hạn'}
                                    {task.deadline === today && task.status !== 'Hoàn thành' && ' ⏰ Hôm nay'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="detail-description-section">
                    <h3>Mô tả chi tiết</h3>
                    {isEditing ? (
                        <textarea
                            className="edit-input desc-input"
                            value={editData.description}
                            onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                            placeholder="Mô tả chi tiết task..."
                            rows={5}
                        />
                    ) : (
                        <div className="description-box">
                            <p>{task.description}</p>
                        </div>
                    )}
                </div>

                {task.image && !isEditing && (
                    <div className="detail-attachment-section">
                        <h3>Tài liệu đính kèm</h3>
                        <div className="attachment-preview">
                            <img src={task.image} alt="Đính kèm task" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetail;
