import React from 'react';
import { Outlet } from 'react-router-dom';
import Side from '../components/Sidebar';
import Nav from '../components/Navbar';

function AdminLayout() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-blue-500 selection:text-white">
            {/* Admin Sidebar Navigation */}
            <Side />

            {/* Main Content Viewport */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-950 min-h-screen overflow-y-auto">
                <Nav />
                <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;
