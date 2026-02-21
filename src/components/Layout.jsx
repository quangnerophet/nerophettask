import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, user, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="layout">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar
                user={user}
                onLogout={onLogout}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="main-wrapper">
                {/* Mobile top bar */}
                <header className="mobile-topbar">
                    <button
                        className="hamburger-btn"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Menu"
                    >
                        <span /><span /><span />
                    </button>
                    <div className="mobile-logo">Nero Phết</div>
                </header>

                <main className="main-content">
                    {children}
                </main>
            </div>

            <button className="help-button">?</button>
        </div>
    );
};

export default Layout;
