import api from "./api";

export async function createCheckin(name: string) {
  const response = await api.post("/checkins", { name });

  return response.data;
}

export async function getCheckins(active: boolean | null, limit: number | null) {

  const params = new URLSearchParams();

  active && params.append("active", String(active));
  params.append("limit", String(limit));

  const response = await api.get("/checkins", {params})

  return response.data;

}

export async function updateCheckin(id: number, team: string) {
  const response = await api.put(`/checkins/${id}`, {
    team,
  });
  
  return response.data;
}

export async function updateCheckinPosition(id: number, before_checkin_id: number | null, after_checkin_id: number | null, team: string | null) {
  const response = await api.patch(`checkins/${id}`, {
      before_checkin_id,
      after_checkin_id,
      team
    })

    return response.data
}

export async function deleteCheckin(id: number) {
  const response = await api.delete(`/checkins/${id}`);

  return response.data;
}

