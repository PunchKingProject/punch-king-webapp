export const WEIGHT_CLASSES = [
  {
    value: 'lightweight',
    label: 'Lightweight — up to 61.23kg / 135lbs',
    maxWeightKg: 61.23,
  },
  {
    value: 'welterweight',
    label: 'Welterweight — up to 66.68kg / 147lbs',
    maxWeightKg: 66.68,
  },
  {
    value: 'middleweight',
    label: 'Middleweight — up to 72.57kg / 160lbs',
    maxWeightKg: 72.57,
  },
] as const;

export type WeightClass =
  | 'lightweight'
  | 'welterweight'
  | 'middleweight';

export type PostStats = {
  total_posts: number;
  total_comments: number;
  total_unique_sponsors: number;
};

export type Envelope<T> = {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: T;
};

export type PostComment = {
  id: number;
  post_id: number;
  content: string;
  commenter: string;
  replies: unknown | null;
  created_at: string;
};

export type TeamPost = {
  id: number;
  team_id: number;

  // Current backend response
  team_name: string;

  // Compatibility with older frontend responses
  team?: string;

  title: string;
  caption: string;
  file_url: string | null;

  boxer_name: string;
  weight_class: WeightClass | '';
  boxer_weight_kg: number;
  shorts_color: string;
  glove_color: string;
  opponent_name: string;
  opponent_weight_kg: number;
  opponent_shorts_color: string;
  sparring_location: string;

  comments: PostComment[];
  comments_count: number;
  sponsorships: number;
  sponsors: number;
  created_at: string;
};

export type CreatePostPayload = {
  title: string;
  caption: string;
  file_url: string;

  boxer_name: string;
  weight_class: WeightClass;
  boxer_weight_kg: number;
  shorts_color: string;
  glove_color: string;
  opponent_name: string;
  opponent_weight_kg: number;
  opponent_shorts_color: string;
  sparring_location: string;
};

export type EditPostPayload = {
  post_id: number;

  title?: string;
  caption?: string;
  file_url?: string;

  boxer_name?: string;
  weight_class?: WeightClass;
  boxer_weight_kg?: number;
  shorts_color?: string;
  glove_color?: string;
  opponent_name?: string;
  opponent_weight_kg?: number;
  opponent_shorts_color?: string;
  sparring_location?: string;
};

export type DeletePostPayload = {
  id: number;
};