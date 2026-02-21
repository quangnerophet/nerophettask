import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User2, Calendar, Edit, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getStatusClass, getPriorityClass } from '../utils/helpers';
import './TaskDetail.css';

const TaskDetail = ({ tasks, user, onUpdateTask }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find the task by ID. Parse ID from string to int for comparison if needed.
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

    return (
        <div className="task-detail-page">
            <header className="detail-header-actions">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                    <span>Quay lại</span>
                </button>
                <div className="detail-header-buttons">
                    <button className="edit-btn">
                        <Edit size={16} /> Chỉnh sửa
                    </button>
                </div>
            </header>

            <div className="task-detail-content card">
                <div className="detail-title-row">
                    <h1>{task.title}</h1>
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
                            <span className="meta-value">{task.assignees.join(', ')}</span>
                        </div>
                    </div>
                    <div className="meta-card">
                        <Calendar size={16} color="#64748B" />
                        <div className="meta-text">
                            <span className="meta-label">Thời hạn</span>
                            <span className="meta-value">{task.deadline}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-description-section">
                    <h3>Mô tả chi tiết</h3>
                    <div className="description-box">
                        <p>{task.description}</p>
                    </div>
                </div>

                {task.image && (
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
