import React from 'react';
import { createContext, useContext, useState } from 'react'
import api from '../utils/axios'
import type { Task } from '../types/api'
import type { ChecklistItem } from '../types/api'
import { statusToEn } from '../utils/statusMaps';


interface Ctx {
    tasks: Task[]
    fetchRoot: () => Promise<void>
    create: (payload: Partial<Task>) => Promise<void>
    update: (id: number, p: Partial<Task>) => Promise<void>
    remove: (id: number) => Promise<void>
    updateStatus: (id: number, newPtStatus: string) => Promise<void>
    deleteItem: (id: number) => Promise<void>
}

const TaskContext = createContext<Ctx>(null as never)
export const useTasks = () => useContext(TaskContext)

export function TaskProvider({ children }: React.PropsWithChildren<{}>) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [checklist, setChecklist] = useState<ChecklistItem[]>([])

    async function fetchRoot() {
        try {
            const response = await api.get<Task[]>('/tasks');
            if (response.status === 204 || !response.data) {
                setTasks([]);
            } else {
                const payload = response.data as any;
                let items: Task[] = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload.data)
                        ? payload.data
                        : [];
                if (items.length > 0) {
                    items = items.filter(item => item.parent_task_id === null);
                }
                setTasks(items);
            }
        } catch (e) {
            setTasks([]);
        }
    }

    async function create(payload: Partial<Task>) {
        try {
            console.log('criando tarefa com payload:', payload);
            const { data } = await api.post('/tasks', {
                ...payload,
            });
            console.log('tarefa criada:', data);
            setTasks(prev => [...prev, data]);
        } catch (err) {
            console.error('falha ao criar tarefa:', err);
        }
    }
    async function update(id: number, payload: Partial<Task>) {
        const { data } = await api.patch(`/tasks/${id}`, payload)
        setTasks(prev => prev.map(t => (t.id === id ? data : t)))
    }

    async function remove(id: number) {
        await api.delete(`/tasks/${id}`)
        setTasks(prev => prev.filter(t => t.id !== id))
    }

    async function deleteItem(id: number) {
        await api.delete(`/checklist-items/${id}`)
        setChecklist((c: ChecklistItem[]) => c.filter((i: ChecklistItem) => i.id !== id))
    }

    async function updateStatus(id: number, newPtStatus: string) {
        const status = statusToEn[newPtStatus] as Task['status']   // pt → en, ensure correct type
        await api.patch(`/tasks/${id}`, { status })     // PATCH /tasks/:id
        setTasks(prev =>
            prev.map(t => (t.id === id ? { ...t, status } : t))
        )
    }

    const value = { tasks, fetchRoot, create, update, remove, updateStatus, deleteItem }
    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}


