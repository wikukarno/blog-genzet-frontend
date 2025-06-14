export type Article = {
  id: number;
  user_id: string;
  category_id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    username: string;
  };
};

export type ArticleResponse = {
  current_page: number;
  data: Article[];
  total: number;
  per_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

export type ArticleApiResponse = {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: ArticleResponse;
};
