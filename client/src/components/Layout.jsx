import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckSquare } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background text-text">
            <nav className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container-custom py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="text-primary" size={28} />
                        <span className="text-xl font-bold font-outfit tracking-tight">TaskFlow</span>
                    </div>
                    {user && (
                        <div className="flex items-center gap-6">
                            <span className="text-sm text-text-muted">Hi, <span className="text-text font-medium">{user.name || user.email}</span></span>
                            <button
                                onClick={logout}
                                className="text-text-muted hover:text-text flex items-center gap-2 text-sm font-medium transition-colors"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
            <main className="container-custom py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
