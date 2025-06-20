// resources/js/utils/statusMaps.ts
export const statusToPt: Record<string, string> = {
    pending: 'Pendente',
    in_progress: 'Em andamento',
    done: 'Concluída',
}
export const statusToEn = Object.fromEntries(
    Object.entries(statusToPt).map(([en, pt]) => [pt, en])
) as Record<string, string>
