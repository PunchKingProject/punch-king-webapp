import { customFetch } from '../../../../Axios.ts';
import type {
  CreatePostPayload,
  DeletePostPayload,
  EditPostPayload,
  Envelope,
  PostStats,
  PublicPostsPayload,
  TeamPost,
  WeightClass,
} from './catalogue.types.ts';

export async function getPostsByWeightClass(
  weightClass: WeightClass,
  options?: {
    cursor?: number;
    limit?: number;
    search?: string;
  }
): Promise<PublicPostsPayload> {
  const params = new URLSearchParams();

  params.set('weight_class', weightClass);
  params.set('limit', String(options?.limit ?? 12));

  if (options?.cursor) {
    params.set('cursor', String(options.cursor));
  }

  if (options?.search?.trim()) {
    params.set('search', options.search.trim());
  }

  const { data } = await customFetch.get<
    Envelope<PublicPostsPayload>
  >(`/post/all-posts?${params.toString()}`);

  return data.data;
}

export async function getPostStats(): Promise<PostStats> {
  const { data } = await customFetch.get<Envelope<PostStats>>(
    '/post/post-stats'
  );
  return data.data;
}

export async function getTeamPosts(): Promise<TeamPost[]> {
  const { data } = await customFetch.get<Envelope<TeamPost[]>>(
    '/post/team-posts'
  );
  return data.data;
}

export async function createTeamPost(payload: CreatePostPayload) {
  // POST {{HOST}}/post
  const { data } = await customFetch.post('/post/', payload);
  return data; // adjust typing if your API returns { meta, data }
}

export async function editTeamPost(payload: EditPostPayload): Promise<TeamPost> {
  const { data } = await customFetch.patch('/post/', payload);
  return data.data;
}

export async function deleteTeamPost(payload: DeletePostPayload): Promise<void> {
  await customFetch.delete(`/post/${payload.id}`);
}

export async function getTeamPostById(postId: number ): Promise<TeamPost> {
  const { data } = await customFetch.get<Envelope<TeamPost>>(
    `/post/${postId}`
  );
  return data.data;
}

export type PublicPostsMeta = {
  next_cursor: number;
  limit: number;
  weight_class?: string;
};

export type PublicPostsPayload = {
  posts: TeamPost[];
  meta: PublicPostsMeta;
};