import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, user, onLogout }) => {
    return (
        <div className="layout">
            <Sidebar user={user} onLogout={onLogout} />
            <main className="main-content">
                {children}
            </main>
            <button className="help-button">?</button>
        </div>
    );
};

export default Layout;
