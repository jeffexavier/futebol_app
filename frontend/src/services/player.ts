import api from "./api";

import type { UpdatePlayer } from "@/types/player";

export async function getPlayers() {
    const result = await api.get("/players")
    return result.data
}

export async function updatePlayer(player_id: number, new_data: UpdatePlayer) {
    const result = await api.put(`/players/${player_id}`, new_data)
    return result.data
}