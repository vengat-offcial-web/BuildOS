import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, DataProvider, useAuth } from './context';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import WorkerLayout from './layouts/WorkerLayout';
import Login from './Login';
import { Dashboard,Projects,ProjectDetails,AssignProject,Workers,Materials,Machines,Tasks,Reports,Settings,WorkerDashboard,WorkerSettings} from './pages/index';

// Root redirect handler based on current user role
function RootRedirect() {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (user.role === 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/worker/dashboard" replace />;
}
function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Login Route */}
                        <Route path="/login" element={<Login />} />

                        {/* Root Redirect */}
                        <Route path="/" element={<RootRedirect />} />

                        {/* Admin Portal Protected Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route element={<AdminLayout />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/projects" element={<Projects />} />
                                <Route path="/projects/new" element={<AssignProject />} />
                                <Route path="/assign-project" element={<AssignProject />} />
                                <Route path="/projects/:id" element={<ProjectDetails />} />
                                <Route path="/workers" element={<Workers />} />
                                <Route path="/materials" element={<Materials />} />
                                <Route path="/machines" element={<Machines />} />
                                <Route path="/tasks" element={<Tasks />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/settings" element={<Settings />} />
                            </Route>
                        </Route>

                        {/* Worker Portal Protected Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['worker']} />}>
                            <Route element={<WorkerLayout />}>
                                <Route path="/worker/dashboard" element={<WorkerDashboard />} />
                                <Route path="/worker/settings" element={<WorkerSettings />} />
                            </Route>
                        </Route>

                        {/* Fallback Catch-All */}
                        <Route path="*" element={<RootRedirect />} />
                    </Routes>
                </BrowserRouter>
            </DataProvider>
        </AuthProvider>
    );
}
export default App;