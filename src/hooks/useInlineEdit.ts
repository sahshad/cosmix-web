import { useState } from "react";

interface MutateOptions {
  onSuccess: () => void;
}

type EditMutate<TId> = (
  variables: { id: TId; content: string },
  options: MutateOptions
) => void;

/**
 * Shared edit-in-place state machine for posts/comments: both mutate with
 * the same { id, content } shape and close edit mode on success.
 */
export function useInlineEdit<TId extends string | number>(
  id: TId,
  initialContent: string,
  mutate: EditMutate<TId>
) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);

  const startEdit = () => setIsEditing(true);

  const cancelEdit = () => {
    setContent(initialContent);
    setIsEditing(false);
  };

  const saveEdit = () => {
    if (!content.trim()) return;
    mutate({ id, content: content.trim() }, { onSuccess: () => setIsEditing(false) });
  };

  return { isEditing, content, setContent, startEdit, cancelEdit, saveEdit };
}
