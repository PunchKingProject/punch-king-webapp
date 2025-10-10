import { customFetch } from '../../../../Axios';
import type {
  AllPostsPayload,
  CreateCommentPayload,
  CreateCommentResponse,
  Envelope,
  FetchAllPostsParams,
  FetchRankedTeamsParams,
  PostDetail,
  RankedTeamsPayload,
  UserStats,
  UserStatsParams,
  VotePayload,
  VoteResponse,
} from './dashboard.types';

export async function getUserStats(
  params: UserStatsParams
): Promise<UserStats> {
  const { data } = await customFetch.get<Envelope<UserStats>>(
    '/user/single-user-stats',
    { params }
  );
  return data.data;
}

export async function getAllPosts(
  params: FetchAllPostsParams
): Promise<AllPostsPayload> {
  const { data } = await customFetch.get<Envelope<AllPostsPayload>>(
    '/post/all-posts',
    { params }
  );
  return data.data;
}

export async function getRankedTeams(
  params: FetchRankedTeamsParams
): Promise<RankedTeamsPayload> {
  const { data } = await customFetch.get<Envelope<RankedTeamsPayload>>(
    '/user/ranked-team',
    { params }
  );
  return data.data;
}

export async function getPostById(postId: number): Promise<PostDetail> {
  const { data } = await customFetch.get<Envelope<PostDetail>>(
    `/post/${postId}`
  );
  return data.data;
}

export async function createComment(
  body: CreateCommentPayload
): Promise<CreateCommentResponse> {
  const { data } = await customFetch.post<Envelope<CreateCommentResponse>>(
    '/comment/',
    body
  );
  return data.data;
}

export async function voteForPost(payload: VotePayload): Promise<VoteResponse> {
  const { data } = await customFetch.post<Envelope<VoteResponse>>(
    '/sponsorship/vote',
    payload
  );
  return data.data;
}
