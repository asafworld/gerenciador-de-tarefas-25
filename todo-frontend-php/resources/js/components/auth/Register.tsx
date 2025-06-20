// Register.tsx – cadastro de usuário usando AuthContext

import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import React from 'react';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface ErrorBag {
    [key: string]: string[];
}

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<ErrorBag>({});
    const [loading, setLoading] = useState(false);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const { data } = await api.post('/auth/register', form);
            if (data?.access_token) {
                login(data.access_token);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                alert('Erro ao registrar, tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={submit} className="w-full max-w-sm bg-white shadow p-6 rounded">
                <h1 className="text-xl font-bold mb-4">Criar conta</h1>

                <label className="block text-sm mb-1">Nome</label>
                <input
                    type="text"
                    name="name"
                    className="w-full p-2 mb-2 border rounded"
                    value={form.name}
                    onChange={handleChange}
                />
                {errors?.name?.[0] && <p className="text-red-600 text-xs mb-2">{errors.name[0]}</p>}

                <label className="block text-sm mb-1">E‑mail</label>
                <input
                    type="email"
                    name="email"
                    className="w-full p-2 mb-2 border rounded"
                    value={form.email}
                    onChange={handleChange}
                />
                {errors?.email?.[0] && <p className="text-red-600 text-xs mb-2">{errors.email[0]}</p>}

                <label className="block text-sm mb-1">Senha</label>
                <input
                    type="password"
                    name="password"
                    className="w-full p-2 mb-2 border rounded"
                    value={form.password}
                    onChange={handleChange}
                />
                {errors?.password?.[0] && <p className="text-red-600 text-xs mb-2">{errors.password[0]}</p>}

                <label className="block text-sm mb-1">Confirmar Senha</label>
                <input
                    type="password"
                    name="password_confirmation"
                    className="w-full p-2 mb-4 border rounded"
                    value={form.password_confirmation}
                    onChange={handleChange}
                />

                <button
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Criando…' : 'Registrar'}
                </button>

                <p className="mt-4 text-sm text-center">
                    Já tem conta?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Entrar
                    </Link>
                </p>
            </form>
        </div>
    );
}
