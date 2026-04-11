import { customFetch } from '../../../../Axios';
import type {
  AllPostsPayload,
  CreateCommentPayload,
  CreateCommentResponse,
  Envelope,
  FeedPost,
  FetchAllPostsParams,
  FetchRankedTeamsParams,
  PostDetail,
  RankedTeam,
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
   const payload = data.data;
   // normalize here
   return {
     meta: payload?.meta ?? { limit: params.limit, next_cursor: null },
     posts: Array.isArray(payload?.posts) ? (payload!.posts as FeedPost[]) : [],
   };
}

export async function getRankedTeams(
  params: FetchRankedTeamsParams
): Promise<RankedTeamsPayload> {
  const { data } = await customFetch.get<Envelope<RankedTeamsPayload>>(
    '/user/ranked-team',
    { params }
  );
  const payload = data.data;
  return {
    data: Array.isArray(payload?.data) ? (payload!.data as RankedTeam[]) : [],
    metadata: payload?.metadata ?? {
      current_page: 1,
      page_size: 0,
      total_count: 0,
      last_page: 0,
    },
  };
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
