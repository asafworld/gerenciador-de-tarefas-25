import React from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';            // ok
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';

ReactDOM.render(
    <AuthProvider>
        <TaskProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </TaskProvider>
    </AuthProvider>,
    document.getElementById('root') as HTMLElement
);
