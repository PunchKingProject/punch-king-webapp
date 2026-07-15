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

export type PostStatus =
  | 'pending'
  | 'approved'
  | 'hidden'
  | 'rejected';

export interface Envelope<T> {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: T;
}

export interface Team {
  id: number;
  firstname?: string;
  lastname?: string;
  organization_name?: string;
  profile_image?: string;
}

export interface PostComment {
  id: number;
  post_id: number;
  content: string;
  commenter?: string;
  created_at: string;
  replies?: PostComment[];
}

export interface TeamPost {
  id: number;

  team_id: number;

  title: string;
  caption: string;

  file: string;

  boxer_name: string;
  weight_class: WeightClass;

  boxer_weight_kg: number;

  shorts_color: string;
  glove_color: string;

  opponent_name: string;
  opponent_weight_kg: number;
  opponent_shorts_color: string;

  sparring_location: string;

  status: PostStatus;

  comments: PostComment[];

  comments_count: number;
  sponsorships_count: number;
  sponsors_count: number;

  team?: Team;

  created_at: string;
  updated_at: string;
}

export interface CreatePostPayload {
  title: string;
  caption: string;

  file: string;

  boxer_name: string;
  weight_class: WeightClass;

  boxer_weight_kg: number;

  shorts_color: string;
  glove_color: string;

  opponent_name: string;
  opponent_weight_kg: number;
  opponent_shorts_color: string;

  sparring_location: string;
}

export interface EditPostPayload {
  post_id: number;

  title?: string;
  caption?: string;

  file?: string;

  boxer_name?: string;
  weight_class?: WeightClass;

  boxer_weight_kg?: number;

  shorts_color?: string;
  glove_color?: string;

  opponent_name?: string;
  opponent_weight_kg?: number;
  opponent_shorts_color?: string;

  sparring_location?: string;

  status?: PostStatus;
}

export interface DeletePostPayload {
  post_id: number;
}

export interface PostStats {
  total_posts: number;
  total_comments: number;
  total_unique_sponsors: number;
}

export interface PublicPostsMeta {
  next_cursor: number;
  limit: number;
  weight_class?: WeightClass;
}

export interface PublicPostsPayload {
  posts: TeamPost[];
  meta: PublicPostsMeta;
}