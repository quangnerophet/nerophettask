import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin, users }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const foundUser = users.find(u => u.username === username && u.password === password);
        if (foundUser) {
            if (!foundUser.isActive) {
                setError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.');
                return;
            }
            onLogin(foundUser);
            setError('');
        } else {
            setError('Email hoặc mật khẩu không chính xác!');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 11l3 3L22 4"></path>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                    </div>
                    <h1>Nero Phết Quản lý Tasks</h1>
                    <p>Đăng nhập để tiếp tục</p>
                </div>

                <form className="login-form" onSubmit={handleLoginSubmit}>
                    {error && <div className="error-message" style={{ color: '#ef4444', textAlign: 'center', marginBottom: 16, fontSize: 14 }}>{error}</div>}
                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input
                            type="text"
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Đăng nhập</button>
                </form>
            </div>
            <button className="help-button">?</button>
        </div>
    );
};

export default Login;
