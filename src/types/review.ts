export type CategoryType = 'bugs' | 'improvements' | 'security' | 'style';

export interface ReviewItem {
  line?: number;
  description: string;
}

export interface ReviewCategory {
  type: CategoryType;
  label: string;
  emoji: string;
  items: ReviewItem[];
}

export interface ReviewResponse {
  categories: ReviewCategory[];
}

export interface ReviewRequest {
  code: string;
  language: string;
}

export interface HistoryEntry {
  id: string;
  code: string;
  language: string;
  review: ReviewResponse;
  createdAt: number;
}
