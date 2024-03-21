export interface DiaryEntry {
  id: number;
  date: string;
  visibility: string;
  weather: string;
  comment: string;
}

export type Visibility = "great" | "good" | "ok" | "poor";

export type Weather = "sunny" | "rainy" | "cloudy" | "windy" | "stormy";

export type NewDiaryEntry = Omit<DiaryEntry, "id">;
