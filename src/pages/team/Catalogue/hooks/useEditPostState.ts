// hooks/useEditPostState.ts
import { useLocation, useSearchParams } from 'react-router-dom';
import { usePostById } from './usePostById'; // your existing or new hook

type EditPost = {
  id: number;
  title: string;
  caption: string;
  file_url: string | null;
} | null;

export function useEditPostState() {
  const [searchParams] = useSearchParams();
  const { state } = useLocation();

  const editId = searchParams.get('edit');
  const isEditMode = editId !== null;

  // State passed from the catalogue page navigation
  const statePost = (state as EditPost) ?? null;

  // Fallback fetch if user refreshed and lost router state
  const { data: fetchedPost, isLoading } = usePostById(
    isEditMode && !statePost ? Number(editId) : undefined
  );

  const editPost: EditPost = statePost ?? (fetchedPost
    ? {
      id: fetchedPost.id,
      title: fetchedPost.title,
      caption: fetchedPost.caption,
      file_url: fetchedPost.file_url,
    }
    : null);

  return { isEditMode, editPost, isLoading: isEditMode && !statePost && isLoading };
}