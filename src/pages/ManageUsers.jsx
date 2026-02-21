import React, { useState, useEffect } from 'react';
import { UserPlus, UserCircle, Settings, FileText, Lock, Unlock, ShieldAlert, Edit2 } from 'lucide-react';
import './ManageUsers.css';

const ManageUsers = ({ users, onAddUser, onEditUser, onToggleUser, currentUser }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newName, setNewName] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newRole, setNewRole] = useState('Nhân viên');
    const [customPassword, setCustomPassword] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');

    useEffect(() => {
        if (editingUser) {
            setNewName(editingUser.name);
            setNewUsername(editingUser.username);
            setNewRole(editingUser.role);
            setCustomPassword('');
            setGeneratedPassword('');
            setIsAdding(true);
        }
    }, [editingUser]);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (editingUser) {
            onEditUser(editingUser.id, {
                name: newName,
                username: newUsername,
                role: newRole
            });
            resetForm();
        } else {
            const pwd = customPassword.trim() || Math.random().toString(36).slice(-8);
            const newUser = {
                id: Date.now(),
                name: newName,
                username: newUsername,
                role: newRole,
                password: pwd,
                isFirstLogin: true,
                isActive: true
            };
            onAddUser(newUser);
            setGeneratedPassword(pwd);
        }
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingUser(null);
        setNewName('');
        setNewUsername('');
        setNewRole('Nhân viên');
        setCustomPassword('');
        setGeneratedPassword('');
    };

    return (
        <div className="manage-users-page">
            <header className="page-header-row">
                <div className="page-title">
                    <h1>Quản lý Nhân sự</h1>
                    <p>Thêm, sửa và phân quyền tài khoản cho nhân viên</p>
                </div>
                {!isAdding && (
                    <button className="create-task-btn" onClick={() => { setEditingUser(null); setIsAdding(true); }}>
                        <UserPlus size={16} />
                        <span>Thêm nhân sự mới</span>
                    </button>
                )}
            </header>

            {isAdding && (
                <div className="card add-user-card">
                    {generatedPassword && !editingUser ? (
                        <div className="success-message">
                            <h3><Settings size={20} color="#10B981" /> Đã tạo tài khoản thành công!</h3>
                            <p>Hệ thống đã lưu tài khoản <strong>{newUsername}</strong>.</p>
                            <div className="password-reveal">
                                <span>Mật khẩu mặc định:</span>
                                <code>{generatedPassword}</code>
                            </div>
                            <p className="notice">Nhân viên sẽ được yêu cầu đổi mật khẩu trong lần đăng nhập đầu tiên.</p>
                            <button className="primary-btn" onClick={resetForm}>Hoàn tất</button>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit} className="add-user-form">
                            <h3><UserPlus size={18} /> {editingUser ? 'Cập nhật tài khoản' : 'Thông tin tài khoản mới'}</h3>
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} required placeholder="VD: Nguyễn Văn A" />
                            </div>
                            <div className="form-group">
                                <label>Tên đăng nhập</label>
                                <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} required placeholder="VD: an.nguyen" />
                            </div>
                            <div className="form-group">
                                <label>Vai trò (Role)</label>
                                <select value={newRole} onChange={e => setNewRole(e.target.value)}>
                                    <option value="Nhân viên">Nhân viên (Chỉ nhận việc)</option>
                                    <option value="Quản lý">Quản lý (Có thể giao việc)</option>
                                    <option value="Quản trị viên">Quản trị viên (Toàn quyền)</option>
                                </select>
                            </div>
                            {!editingUser && (
                                <div className="form-group">
                                    <label>Mật khẩu khởi tạo (Tùy chọn)</label>
                                    <input type="text" value={customPassword} onChange={e => setCustomPassword(e.target.value)} placeholder="Để trống để hệ thống tự tạo ngẫu nhiên" />
                                </div>
                            )}
                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={resetForm}>Hủy</button>
                                <button type="submit" className="submit-btn">{editingUser ? 'Lưu thay đổi' : 'Tạo tài khoản'}</button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            <div className="users-list card">
                <h3><UserCircle size={18} /> Danh sách phân quyền hiện tại ({users.length})</h3>
                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Họ và tên</th>
                                <th>Tên đăng nhập</th>
                                <th>Vai trò</th>
                                <th>Trạng thái tài khoản</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => {
                                let statusLabel = "";
                                let statusClass = "";
                                if (!u.isActive) {
                                    statusLabel = "Đã khóa";
                                    statusClass = "status-locked";
                                } else if (u.isFirstLogin) {
                                    statusLabel = "Chờ kích hoạt";
                                    statusClass = "status-pending-act";
                                } else {
                                    statusLabel = "Đang hoạt động";
                                    statusClass = "status-active";
                                }

                                return (
                                    <tr key={u.id} className={!u.isActive ? 'user-inactive' : ''}>
                                        <td>
                                            <strong>{u.name}</strong>
                                        </td>
                                        <td><FileText size={14} color="#6C757D" style={{ marginRight: 4, verticalAlign: 'middle' }} /> {u.username}</td>
                                        <td>
                                            <span className={`role-badge role-${u.role === 'Quản trị viên' ? 'admin' : u.role === 'Quản lý' ? 'manager' : 'employee'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`account-status-badge ${statusClass}`}>
                                                {!u.isActive && <ShieldAlert size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                                                {u.isActive && u.isFirstLogin && <Lock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                                                {u.isActive && !u.isFirstLogin && <Unlock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                                                {statusLabel}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons-wrapper">
                                                <select
                                                    className={`action-dropdown ${!u.isActive ? 'action-locked' : 'action-active'}`}
                                                    value={u.isActive ? "active" : "locked"}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value === "active";
                                                        if (newValue !== u.isActive) {
                                                            onToggleUser(u.id);
                                                        }
                                                    }}
                                                    disabled={u.id === currentUser?.id}
                                                >
                                                    <option value="active">Đang hoạt động</option>
                                                    <option value="locked">Khóa tài khoản</option>
                                                </select>
                                                <button
                                                    className="edit-user-btn"
                                                    onClick={() => setEditingUser(u)}
                                                    title="Chỉnh sửa thông tin"
                                                >
                                                    <Edit2 size={14} /> Sửa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
