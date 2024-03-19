import axios from "axios";
import { DiaryEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

const getAllDiaries: () => Promise<DiaryEntry[]> = async () => {
  return axios.get<DiaryEntry[]>(baseUrl).then((response) => response.data);
};

export default { getAllDiaries };
