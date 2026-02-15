import api from "./api";

export async function getMatch(){
    const response = await api.get('/matches');
    return response.data;
};

export async function randomizeTeams() {
    try {
        const response = await api.post('/matches/randomize');
        return response.data;
    } catch (error) {
        console.error(error);
    };
};

export async function rotateLoserTeam(result: string) {
    try {
        const response = await api.post('/matches', {result});
        return response.data
    } catch (error) {
        console.error(error);
    };
};