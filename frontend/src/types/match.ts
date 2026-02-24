import { CheckinItem } from "./checkin";

export interface MatchResponse {
  team_a: CheckinItem[]; // Lista de CheckinItems
  team_b: CheckinItem[]; // Lista de CheckinItems
  waiting_team_1: CheckinItem[];
  waiting_team_2: CheckinItem[];
  following_list: CheckinItem[]; // Lista de CheckinItems
  can_randomize: boolean | null;
  can_choose_draw: boolean | null;
  match_time_rule: string;
  next_up: string | null; // Pode ser null
}
