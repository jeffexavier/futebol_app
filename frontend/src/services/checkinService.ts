import { api } from "./api";

export const createCheckin = async (playerName: string) => {
    const response = await api.post('/checkins/', {
        name: playerName
    })
    return response.data;
}