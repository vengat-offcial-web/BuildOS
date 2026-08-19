import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, Navbar } from '../components';

function getSearchPlaceholder(pathname) {
    if (pathname === '/' || pathname === '/dashboard') return 'Search Projects...';
    if (pathname.startsWith('/projects')) return 'Search Projects...';
    if (pathname.startsWith('/workers')) return 'Search Workers...';
    if (pathname.startsWith('/materials')) return 'Search Materials...';
    if (pathname.startsWith('/tasks')) return 'Search Tasks...';
    if (pathname.startsWith('/reports')) return 'Search Reports...';
    if (pathname.startsWith('/settings')) return 'Search Settings...';
    return 'Search BuildOS...';
}

function AdminLayout() {
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();

    // Reset search term when navigating to a different section
    useEffect(() => {
        setSearchTerm('');
    }, [location.pathname]);

    const currentPlaceholder = getSearchPlaceholder(location.pathname);

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#03020A] flex flex-col md:flex-row relative antialiased">
            {/* Ambient Pastel Background Glows */}
            <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-[#E9D5FF]/40 via-[#C4B5FD]/25 to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[15%] w-[550px] h-[550px] bg-gradient-to-tr from-[#F0FDC2]/50 via-[#E4F9A8]/30 to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>

            {/* Sticky Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Viewport */}
            <main className="flex-1 flex flex-col min-w-0 min-h-screen z-10 relative">
                <Navbar 
                    searchValue={searchTerm} 
                    onSearchChange={setSearchTerm} 
                    placeholder={currentPlaceholder}
                />
                <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
                    <Outlet context={{ searchTerm, setSearchTerm }} />
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;

