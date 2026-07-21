export interface Deployment {
  id: string;
  version: string;
  status: "rolled" | "ok";
  message: string;
  time: string;
}