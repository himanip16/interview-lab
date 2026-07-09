export type Interview = {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
};