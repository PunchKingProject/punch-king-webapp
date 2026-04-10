export type PostStats = {
  total_posts: number;
  total_comments: number;
  total_unique_sponsors: number;
};

export type Envelope<T> = {
  meta: { message: string; code: number; status: string };
  data: T;
};


export type PostComment = {
  id: number;
  post_id: number;
  content: string;
  commenter: string;
  replies: unknown | null;
  created_at: string; // ISO
};

export type TeamPost = {
  id: number;
  team: string;
  title: string;
  caption: string;
  file_url: string | null;
  comments: PostComment[];
  comments_count: number;
  sponsorships: number;
  sponsors: number;
  created_at: string; // ISO
};


export type CreatePostPayload = {
  title: string;
  caption: string;
  file_url: string; // URL returned from POST /img/
};

export type EditPostPayload = {
  post_id: number;
  title: string;
  caption: string;
}

export type DeletePostPayload = {
  id: number;
}