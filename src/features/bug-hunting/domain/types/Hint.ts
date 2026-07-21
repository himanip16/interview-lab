export interface Hint {
  id: string;

  level: number;

  trigger: 
    | "time_elapsed"
    | "user_requested"
    | "wrong_direction";

  message: string;

  penalty?: number;
}