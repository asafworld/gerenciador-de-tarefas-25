import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import PrivateRoute from './PrivateRoute'
import Dashboard from './Dashboard'
import TaskPage from './TaskPage'

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>}
            />
            <Route
                path="/tasks/:id"
                element={
                    <PrivateRoute>
                        <TaskPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/tasks/:taskId/subtasks/:subtaskId"
                element={
                    <PrivateRoute>
                        <TaskPage />
                    </PrivateRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
