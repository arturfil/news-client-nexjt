import { Article } from "./Article";

export interface NewsResponse {
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface NewsFilters {
  state?: string;
  topic?: string;
  search?: string;
}

