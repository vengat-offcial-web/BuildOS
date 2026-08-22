import React from 'react';

export const AuthProvider = ({ children }) => {
    return <>{children}</>;
};

export { useAuth } from './useAuth';
export default AuthProvider;