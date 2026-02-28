import { Player } from "./player";

export interface CheckinItem {
  id: number;
  player_id: number;
  queue_position: number;
  team: string | null;
  arrival_time: string;
  deleted_at: string | null;
  player: Player;
}
