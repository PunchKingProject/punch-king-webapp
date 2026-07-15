import { useLocation, useSearchParams } from 'react-router-dom';

import { usePostById } from './usePostById';

import type {
  TeamPost,
  WeightClass,
} from '../api/catalogue.types';

export interface EditablePost {
  id: number;

  title: string;
  caption: string;
  file_url: string |null;

  boxer_name: string;
  weight_class: WeightClass | '';

  boxer_weight_kg: number;
  shorts_color: string;
  glove_color: string;

  opponent_name: string;
  opponent_weight_kg: number;
  opponent_shorts_color: string;

  sparring_location: string;
}

function mapPost(post: TeamPost): EditablePost {
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

    opponent_shorts_color:
      post.opponent_shorts_color ?? '',

    sparring_location:
      post.sparring_location ?? '',
  };
}

export function useEditPostState() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const editIdParam = searchParams.get('edit');
  const editId = editIdParam ? Number(editIdParam) : undefined;

  const isEditMode =
    !!editId &&
    Number.isInteger(editId) &&
    editId > 0;

  const locationPost =
    location.state &&
    typeof location.state === 'object'
      ? (location.state as TeamPost)
      : null;

  const statePost =
    locationPost &&
    locationPost.id === editId
      ? locationPost
      : null;

  const {
    data,
    isLoading,
    isError,
  } = usePostById(
    isEditMode && !statePost
      ? editId
      : undefined
  );

  const source = statePost ?? data ?? null;

  return {
    isEditMode,

    editPost: source
      ? mapPost(source)
      : null,

    isLoading:
      isEditMode &&
      !statePost &&
      isLoading,

    isError:
      isEditMode &&
      !statePost &&
      isError,
  };
}