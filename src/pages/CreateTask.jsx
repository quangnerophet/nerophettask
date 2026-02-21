import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import './CreateTask.css';

const CreateTask = ({ onAddTask, user, users }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'Nhân viên') {
            navigate('/');
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        title: '',
        assignees: [],
        priority: 'Trung bình',
        deadline: '',
        description: '',
        requirements: '',
        image: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.assignees.length === 0) {
            alert('Vui lòng chọn ít nhất một người thực hiện');
            return;
        }

        const priorityClasses = {
            'Thấp': 'priority-medium',
            'Trung bình': 'priority-medium',
            'Cao': 'priority-high'
        };

        const newTask = {
            ...formData,
            assigner: user?.name || 'Nguyễn Văn An',
            status: 'Chờ xử lý',
            statusClass: 'status-pending',
            priorityClass: priorityClasses[formData.priority] || 'priority-medium'
        };

        onAddTask(newTask);
        navigate('/tasks');
    };

    const handleAssigneeToggle = (userName) => {
        setFormData(prev => {
            const current = prev.assignees;
            const next = current.includes(userName)
                ? current.filter(u => u !== userName)
                : [...current, userName];
            return { ...prev, assignees: next };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="create-task-page">
            <header className="page-header">
                <h1>Tạo Task mới</h1>
                <p>Điền thông tin chi tiết để tạo task và giao cho thành viên</p>
            </header>

            <div className="form-card card">
                <form className="create-task-form" onSubmit={handleSubmit}>
                    <section className="form-section">
                        <h2 className="section-title">Thông tin Task</h2>
                        <p className="section-subtitle">Các trường đánh dấu * là bắt buộc</p>

                        <div className="form-group">
                            <label>Tên Task *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="VD: Thiết kế giao diện trang chủ"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Người nhận * (Chọn ít nhất 1 người)</label>
                            <div className="assignee-selector-grid">
                                {users.filter(u => u.isActive).map(u => (
                                    <label key={u.id} className={`assignee-checkbox-label ${formData.assignees.includes(u.name) ? 'checked' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.assignees.includes(u.name)}
                                            onChange={() => handleAssigneeToggle(u.name)}
                                        />
                                        <span className="checkbox-custom"></span>
                                        <div className="assignee-info">
                                            <span className="assignee-name">{u.name}</span>
                                            <span className="assignee-role-tag">{u.role}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Độ ưu tiên *</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="Thấp">Thấp</option>
                                    <option value="Trung bình">Trung bình</option>
                                    <option value="Cao">Cao</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Hạn hoàn thành *</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Chi tiết công việc *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mô tả chi tiết công việc cần thực hiện..."
                                rows={4}
                                required
                            ></textarea>
                            <p className="field-hint">Mô tả rõ ràng về công việc, phạm vi, và các yêu cầu cụ thể</p>
                        </div>

                        <div className="form-group">
                            <label>Yêu cầu đầu ra *</label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                placeholder="VD:&#10;- File thiết kế hoàn chỉnh&#10;- Tài liệu hướng dẫn&#10;- Báo cáo kết quả"
                                rows={4}
                                required
                            ></textarea>
                            <p className="field-hint">Liệt kê các deliverables và tiêu chí đánh giá</p>
                        </div>

                        <div className="form-group">
                            <label>Hình ảnh minh họa (tùy chọn)</label>
                            <div className="image-upload-box">
                                <label className="upload-btn" style={{ cursor: 'pointer' }}>
                                    <Upload size={18} />
                                    <span>{formData.image ? 'Đổi ảnh' : 'Chọn ảnh'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                {formData.image && (
                                    <div className="image-preview-mini">
                                        <img src={formData.image} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} style={{ border: 'none', background: 'none', color: '#EF4444', fontSize: '12px', cursor: 'pointer' }}>Xóa</button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </section>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Tạo Task</button>
                        <button type="button" className="cancel-btn" onClick={() => navigate('/tasks')}>Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;
