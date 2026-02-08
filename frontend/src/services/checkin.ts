import api from "./api";

export async function createCheckin(name: string) {
    const response = await api.post('/checkins', {name});
    return response.data;
}