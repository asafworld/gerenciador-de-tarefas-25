import React from 'react';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

interface LoginForm {
    email: string;
    password: string;
}

interface ErrorBag {
    [key: string]: string[];
}

export default function Login() {
    const navigate = useNavigate();
    const { login: saveToken } = useAuth();

    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const [errors, setErrors] = useState<ErrorBag>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const { data } = await api.post('/auth/login', form);
            if (data.access_token) {
                saveToken(data.access_token);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                alert('Erro ao entrar. Verifique suas credenciais.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={submit}
                className="w-full max-w-sm p-6 bg-white shadow rounded"
            >
                <h1 className="text-xl font-bold mb-4">Entrar</h1>

                <label className="block text-sm mb-1">E-mail</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded"
                />
                {errors.email && (
                    <p className="text-red-600 text-xs mb-2">{errors.email[0]}</p>
                )}

                <label className="block text-sm mb-1">Senha</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded"
                />
                {errors.password && (
                    <p className="text-red-600 text-xs mb-2">{errors.password[0]}</p>
                )}

                <button
                    disabled={loading}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Entrando…' : 'Entrar'}
                </button>

                <p className="text-center text-sm mt-3">
                    Não possui conta?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Cadastrar
                    </Link>
                </p>
            </form>
        </div>
    );
}
// TaskPage.tsx – detalhe da tarefa, subtarefas e checklist
