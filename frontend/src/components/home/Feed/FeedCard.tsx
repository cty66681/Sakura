export interface FeedItem {
  id: number;

  type:
    | "job"
    | "house"
    | "experience"
    | "scam";

  title: string;

  description: string;

  location?: string;

  publishTime: string;

  cover: string;
}