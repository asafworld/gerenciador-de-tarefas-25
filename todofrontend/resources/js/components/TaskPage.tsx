import React from 'react'
import { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/axios'
import type { Task, ChecklistItem } from '../types/api'
import { statusToEn, statusToPt } from '../utils/statusMaps'
import { useTasks } from '../contexts/TaskContext'

export default function TaskPage() {
    const { id } = useParams()
    const taskId = Number(id)
    const [task, setTask] = useState<Task | null>(null)
    const [loading, setLoading] = useState(false)
    const [subDescription, setSubDescription] = useState('')
    const [itemDescription, setItemDescription] = useState('')
    const { remove, updateStatus, deleteItem } = useTasks()

    useEffect(() => {
        fetchTask()
        // eslint-disable-next-line
    }, [taskId])

    async function fetchTask() {
        setLoading(true)
        try {
            const { data } = await api.get<Task>(`/tasks/${taskId}`)
            setTask(data)
        } finally {
            setLoading(false)
        }
    }

    async function addSubtask(e: FormEvent) {
        e.preventDefault()
        if (!subDescription.trim()) return
        const { data } = await api.post<Task>('/tasks', {
            description: subDescription,
            status: 'pending',
            parent_task_id: taskId,
        })
        setTask(prev => prev ? { ...prev, children: [...(prev.children || []), data] } : prev)
        setSubDescription('')
    }

    async function addChecklistItem(e: FormEvent) {
        e.preventDefault()
        if (!itemDescription.trim()) return
        const { data } = await api.post<ChecklistItem>(`/tasks/${taskId}/checklist-items`, {
            description: itemDescription,
            is_done: false,
        })
        setTask(prev => prev ? { ...prev, checklist_items: [...(prev.checklist_items || []), data] } : prev)
        setItemDescription('')
    }

    async function toggleItem(item: ChecklistItem) {
        const { data } = await api.patch<ChecklistItem>(`/checklist-items/${item.id}`, {
            is_done: !item.is_done,
        })
        setTask(prev => {
            if (!prev) return prev
            const list = prev.checklist_items?.map(ci => (ci.id === data.id ? data : ci)) || []
            return { ...prev, checklist_items: list }
        })
    }

    async function handleDeleteSubtask(subId: number) {
        if (!confirm('Excluir esta subtarefa?')) return
        await remove(subId)
        // filtra do estado local
        setTask(prev =>
            prev
                ? {
                    ...prev,
                    children: (prev.children || []).filter(c => c.id !== subId)
                }
                : prev
        )
    }

    async function handleStatusChange(e: ChangeEvent<HTMLSelectElement>, taskId: number, type: 'task' | 'subtask' = 'task') {
        const newPt = e.target.value
        await updateStatus(taskId, newPt)
        if (type === 'task') {
            setTask(prev => prev ? { ...prev, status: statusToEn[newPt] as Task['status'] } : prev)
        } else {
            // Para subtarefas, atualiza o status diretamente
            setTask(prev => {
                if (!prev) return prev
                const updatedChildren = prev.children?.map(c =>
                    c.id === taskId ? { ...c, status: statusToEn[newPt] as Task['status'] } : c
                )
                return { ...prev, children: updatedChildren }
            })
        }

    }

    async function handleDeleteChecklistItem(itemId: number) {
        if (!confirm('Excluir este item?')) return
        await deleteItem(itemId)
        setTask(prev =>
            prev
                ? {
                    ...prev,
                    checklist_items: (prev.checklist_items || []).filter(i => i.id !== itemId)
                }
                : prev
        )
    }


    if (loading || !task) {
        return <div className="p-6 text-center">Carregando…</div>
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <Link to="/" className="text-blue-600">← Voltar</Link>

            <h1 className="text-2xl font-bold flex items-center gap-2">
                {task.description}
                <select
                    value={statusToPt[task.status]}
                    onChange={e => handleStatusChange(e, task.id)}
                    className="border rounded p-1 text-sm"
                >
                    {Object.values(statusToPt).map(pt => (
                        <option key={pt}>{pt}</option>
                    ))}
                </select>
            </h1>

            {/* Subtarefas */}
            {!task.parent_task_id && <section>
                <h2 className="font-semibold mb-2">Subtarefas</h2>
                <form onSubmit={addSubtask} className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={subDescription}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSubDescription(e.target.value)}
                        placeholder="Descrição da subtarefa"
                        className="flex-1 border p-2 rounded"
                    />
                    <button className="px-3 py-2 bg-blue-600 text-white rounded">Adicionar</button>
                </form>

                <ul className="space-y-1">
                    {task.children?.map(st => (
                        <li key={st.id} className="p-2 bg-white shadow rounded flex justify-between">
                            <span>{st.description}</span>
                            <select
                                value={statusToPt[st.status]}
                                onChange={e => handleStatusChange(e, st.id, 'subtask')}
                                className="border rounded p-1 text-sm"
                            >
                                {Object.values(statusToPt).map(pt => (
                                    <option key={pt}>{pt}</option>
                                ))}
                            </select>
                            <Link
                                to={`/tasks/${st.id}`}
                                className="text-blue-600"
                            >
                                Abrir ›
                            </Link>
                            <button
                                onClick={() => handleDeleteSubtask(st.id)}
                                className="text-red-600"
                            >
                                🗑️
                            </button>
                        </li>
                    ))}
                    {(!task.children || task.children.length === 0) && <p className="text-sm text-gray-500">Nenhuma subtarefa.</p>}
                </ul>
            </section>}

            {/* Checklist */}
            <section>
                <h2 className="font-semibold mb-2">Checklist</h2>
                <form onSubmit={addChecklistItem} className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={itemDescription}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setItemDescription(e.target.value)}
                        placeholder="Descrição do item"
                        className="flex-1 border p-2 rounded"
                    />
                    <button className="px-3 py-2 bg-blue-600 text-white rounded">Adicionar</button>
                </form>

                <ul className="space-y-1">
                    {task.checklist_items?.map(ci => (
                        <li key={ci.id} className="p-2 bg-white shadow rounded flex gap-2 items-center">
                            <input type="checkbox" checked={ci.is_done} onChange={() => toggleItem(ci)} />
                            <span className={ci.is_done ? 'line-through text-gray-500' : ''}>{ci.description}</span>
                            <button
                                onClick={() => handleDeleteChecklistItem(ci.id)}
                                className="ml-2 text-red-600"
                            >
                                ×
                            </button>
                        </li>
                    ))}
                    {(!task.checklist_items || task.checklist_items.length === 0) && <p className="text-sm text-gray-500">Nenhum item.</p>}
                </ul>
            </section>
        </div>
    )
}
