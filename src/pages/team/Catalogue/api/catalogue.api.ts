import { customFetch } from '../../../../Axios.ts';
import type {
  CreatePostPayload,
  DeletePostPayload,
  EditPostPayload,
  Envelope,
  PostStats,
  TeamPost
} from './catalogue.types.ts';

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