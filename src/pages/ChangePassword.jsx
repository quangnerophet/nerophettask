import React, { useState } from 'react';
import './Login.css';

const ChangePassword = ({ user, onPasswordChanged }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp!');
            return;
        }
        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        onPasswordChanged(newPassword);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo" style={{ background: '#F59E0B' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h1>Đổi mật khẩu bắt buộc</h1>
                    <p>Chào <strong>{user.name}</strong>, vì đây là lần đăng nhập đầu tiên, bạn cần thiết lập mật khẩu riêng để bảo mật tài khoản.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: 16, fontSize: 14 }}>{error}</div>}

                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nhập lại mật khẩu</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Cập nhật & Truy cập hệ thống</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
