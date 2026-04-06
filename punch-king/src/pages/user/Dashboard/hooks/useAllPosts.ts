import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllPosts } from "../api/dashboard.api.ts";
import type { AllPostsPayload } from "../api/dashboard.types.ts";



export function useAllPosts(limit = 4) {
  return useInfiniteQuery<
    AllPostsPayload, // TQueryFnData: what queryFn returns (one page)
    Error, // TError
    AllPostsPayload, // TData: the shape of each page in data.pages
    ['all-posts', number], // TQueryKey
    number // TPageParam
  >({
    queryKey: ['all-posts', limit],
    initialPageParam: 0, // first cursor
    queryFn: ({ pageParam }) => getAllPosts({ cursor: pageParam, limit }),
    getNextPageParam: (lastPage, _allPages, lastParam) => {
      const next = lastPage.meta.next_cursor; // number | null
      // stop if API says no next page, or if cursor didn't advance
      if (next == null || next === lastParam) return undefined;
      // some APIs use 0 as sentinel -> also stop
      if (next === 0) return undefined;
      return next; // must be a number
    },
    
  });
}