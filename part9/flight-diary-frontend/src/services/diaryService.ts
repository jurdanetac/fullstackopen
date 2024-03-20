import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

const getAllDiaries: () => Promise<DiaryEntry[]> = async () => {
  return axios.get<DiaryEntry[]>(baseUrl).then((response) => response.data);
};

const createDiary: (newDiary: NewDiaryEntry) => Promise<DiaryEntry> = async (
  newDiary: NewDiaryEntry,
) => {
  return axios
    .post<DiaryEntry>(baseUrl, newDiary)
    .then((response) => response.data);
};

export default { getAllDiaries, createDiary };
