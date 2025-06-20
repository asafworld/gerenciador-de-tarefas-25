export interface ChecklistItem {
    id: number
    description: string
    is_done: boolean
    responsible_user_id: number | null
    created_at: string
    updated_at: string
}

export interface Task {
    id: number
    description: string
    status: 'pending' | 'in_progress' | 'done'
    parent_task_id: number | null
    responsible_user_id: number | null
    children?: Task[]           // só quando obtido via GET /tasks/{id}
    checklist_items?: ChecklistItem[] // idem
    created_at: string
    updated_at: string
}
