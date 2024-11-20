export interface Article {
  id: number;
  econded_id: string;
  title: string;
  description: string;
  content: string;
  source: Source;
  state: string;
  topic: string;
  published_date: string;
  url: string;
}

export interface Source {
  id: string;
  name: string;
}
