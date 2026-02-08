import api from "./api";
// import type { MatchResponse } from "@/types/match";

export async function getMatch(){
    const response = await api.get('/matches');
    return response.data;
}

// export async function getMatch(): Promise<MatchResponse> {
//     const response = await api.get<MatchResponse>('/matches');
//     return response.data;
// }