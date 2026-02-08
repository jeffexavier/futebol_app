import { CheckinItem } from "./checkin";

export interface MatchResponse {
  team_a: CheckinItem[];      // Lista de CheckinItems
  team_b: CheckinItem[];      // Lista de CheckinItems
  waiting_list: CheckinItem[]; // Lista de CheckinItems
  match_time_rule: string;
  next_up: string | null;     // Pode ser null
}