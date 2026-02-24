import api from "./api";

export async function createCheckin(name: string) {
  const response = await api.post("/checkins", { name });

  return response.data;
}

export async function deleteCheckin(id: number) {
  const response = await api.delete(`/checkins/${id}`);

  return response.data;
}

export async function updateCheckin(id: number, team: string) {
  const response = await api.put(`/checkins/${id}`, {
    team,
  });

  return response.data;
}
