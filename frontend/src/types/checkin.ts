import { Player } from "./player";

export interface CheckinItem {
  id: number;
  player_id: number;
  queue_position: number;
  arrival_time: string;
  deleted_at: string | null; // Pode ser null
  player: Player; // <--- Aqui a mágica: aninhamos a interface Player
}