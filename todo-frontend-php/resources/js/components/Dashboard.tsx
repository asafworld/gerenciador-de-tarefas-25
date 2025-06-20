import React, { FormEvent, useState } from 'react'
import { useEffect } from 'react'
import { useTasks } from '../contexts/TaskContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
    const [newDesc, setNewDesc] = useState('')
    const { tasks, fetchRoot, create, remove } = useTasks()

    async function handleCreate(e: FormEvent) {
        e.preventDefault()
        if (!newDesc.trim()) return
        await create({ description: newDesc, status: 'pending' })
        setNewDesc('')
    }

    useEffect(() => {
        fetchRoot();
    }, []);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Minhas Tarefas</h1>

            <form onSubmit={handleCreate} className="flex gap-2 mb-4">
                <input
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Descrição da tarefa"
                    className="flex-1 border p-2 rounded"
                />
                <button className="px-3 py-2 bg-blue-600 text-white rounded">
                    + Criar
                </button>
            </form>

            {tasks.length === 0 ? (
                <p className="text-gray-600">Você ainda não tem tarefas. Crie uma acima!</p>
            ) : (
                <ul className="space-y-2">
                    {tasks.map(t => (
                        <li key={t.id} className="p-3 bg-white shadow rounded flex justify-between">
                            <span>{t.description}</span>
                            <Link to={`/tasks/${t.id}`} className="text-blue-600">Detalhes ›</Link>
                            <button
                                onClick={() =>
                                    confirm('Excluir definitivamente?') && remove(t.id)
                                }
                                className="text-red-600"
                            >
                                🗑️
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
