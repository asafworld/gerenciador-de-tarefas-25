import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
    children: ReactNode;
}

/**
 * Rota protegida: exibe o children se houver usuário autenticado;
 * caso contrário, redireciona para /login.
 */
const PrivateRoute = ({ children }: Props): JSX.Element => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // user autenticado
    return <>{children}</>;
};

export default PrivateRoute;
