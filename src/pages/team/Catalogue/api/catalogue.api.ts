import { customFetch } from '../../../../Axios';
import type {
  CreatePostPayload,
  DeletePostPayload,
  EditPostPayload,
  Envelope,
  PostStats,
  PublicPostsPayload,
  TeamPost,
  WeightClass,
} from './catalogue.types';

/**
 * ===========================
 * PUBLIC POSTS
 * ===========================
 */

export async function getPostsByWeightClass(
  weightClass: WeightClass,
  options?: {
    cursor?: number;
    limit?: number;
    search?: string;
  }
): Promise<PublicPostsPayload> {
  const params = new URLSearchParams();

  if (weightClass) {
    params.append('weight_class', weightClass);
  }

  params.append('limit', String(options?.limit ?? 12));

  if (options?.cursor) {
    params.append('cursor', String(options.cursor));
  }

  if (options?.search?.trim()) {
    params.append('search', options.search.trim());
  }

  const { data } = await customFetch.get<
    Envelope<PublicPostsPayload>
  >(`/post/all-posts?${params.toString()}`);

  return data.data;
}

/**
 * ===========================
 * TEAM POSTS
 * ===========================
 */

export async function getTeamPosts(): Promise<TeamPost[]> {
  const { data } = await customFetch.get<
    Envelope<TeamPost[]>
  >('/post/team-posts');

  return data.data;
}

export async function getTeamPostById(
  postId: number
): Promise<TeamPost> {
  const { data } = await customFetch.get<
    Envelope<TeamPost>
  >(`/post/${postId}`);

  return data.data;
}

/**
 * ===========================
 * CREATE POST
 * ===========================
 */

export async function createTeamPost(
  payload: CreatePostPayload
): Promise<TeamPost> {
  const { data } = await customFetch.post<
    Envelope<TeamPost>
  >('/post', payload);

  return data.data;
}

/**
 * ===========================
 * UPDATE POST
 * ===========================
 */

export async function editTeamPost(
  payload: EditPostPayload
): Promise<TeamPost> {
  const { data } = await customFetch.patch<
    Envelope<TeamPost>
  >('/post', payload);

  return data.data;
}

/**
 * ===========================
 * DELETE POST
 * ===========================
 */

export async function deleteTeamPost(
  payload: DeletePostPayload
): Promise<void> {
  await customFetch.delete('/post', {
    data: payload,
  });
}

/**
 * ===========================
 * POST STATS
 * ===========================
 */

export async function getPostStats(): Promise<PostStats> {
  const { data } = await customFetch.get<
    Envelope<PostStats>
  >('/post/post-stats');

  return data.data;
}