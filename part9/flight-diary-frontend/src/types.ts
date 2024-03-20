export interface DiaryEntry {
  id: number;
  date: string;
  visibility: string;
  weather: string;
  comment: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, "id">;
