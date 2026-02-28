export function formatDateToDateHour(date: string) {
    const newDate = new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })

    return newDate
}

export function formatDateToHour(date: string) {
    const newDate = new Date(date).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })

    return newDate
}