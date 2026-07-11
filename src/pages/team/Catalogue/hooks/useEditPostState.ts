import { useLocation, useSearchParams } from 'react-router-dom';
import type {
  TeamPost,
  WeightClass,
} from '../api/catalogue.types.ts';
import { usePostById } from './usePostById.ts';

export type EditablePost = {
  id: number;
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
};

function mapPostToEditable(post: TeamPost): EditablePost {
  return {
    id: post.id,
    title: post.title ?? '',
    caption: post.caption ?? '',
    file_url: post.file_url ?? null,

    boxer_name: post.boxer_name ?? '',
    weight_class: post.weight_class ?? '',
    boxer_weight_kg: Number(post.boxer_weight_kg ?? 0),
    shorts_color: post.shorts_color ?? '',
    glove_color: post.glove_color ?? '',
    opponent_name: post.opponent_name ?? '',
    opponent_weight_kg: Number(post.opponent_weight_kg ?? 0),
    opponent_shorts_color: post.opponent_shorts_color ?? '',
    sparring_location: post.sparring_location ?? '',
  };
}

export function useEditPostState() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const editId = searchParams.get('edit');
  const parsedEditId = editId ? Number(editId) : undefined;

  const isEditMode =
    parsedEditId !== undefined &&
    Number.isInteger(parsedEditId) &&
    parsedEditId > 0;

  const statePost =
    location.state && typeof location.state === 'object'
      ? (location.state as TeamPost)
      : null;

  const validStatePost =
    statePost && Number(statePost.id) === parsedEditId
      ? statePost
      : null;

  const {
    data: fetchedPost,
    isLoading,
    isError,
  } = usePostById(
    isEditMode && !validStatePost
      ? parsedEditId
      : undefined
  );

  const sourcePost = validStatePost ?? fetchedPost ?? null;

  const editPost = sourcePost
    ? mapPostToEditable(sourcePost)
    : null;

  return {
    isEditMode,
    editPost,
    isLoading:
      isEditMode &&
      !validStatePost &&
      isLoading,
    isError:
      isEditMode &&
      !validStatePost &&
      isError,
  };
}