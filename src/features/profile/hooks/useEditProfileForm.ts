import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteFromCloudinaryByUrl,
} from '@/actions/upload';
import type { CloudinaryFolder } from '@/lib/cloudinary';
import { extractApiError } from '@/lib/error';
import { User } from '@/types/user';
import { useUpdateProfile } from './useUser';

const AVATAR_FOLDER: CloudinaryFolder = 'avatars';
const COVER_FOLDER: CloudinaryFolder = 'covers';

interface UseEditProfileFormArgs {
  open: boolean;
  user: User | undefined;
  onSaved: () => void;
}

export function useEditProfileForm({ open, user, onSaved }: UseEditProfileFormArgs) {
  const updateProfileMutation = useUpdateProfile();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // public_id of an image uploaded this session that hasn't been saved yet
  const pendingAvatarIdRef = useRef<string | null>(null);
  const pendingCoverIdRef = useRef<string | null>(null);
  // the avatar/cover URL as persisted on the server when the dialog opened,
  // so a successful replace can clean up the asset it's replacing
  const originalAvatarUrlRef = useRef('');
  const originalCoverUrlRef = useRef('');
  const isOpenRef = useRef(open);
  isOpenRef.current = open;

  useEffect(() => {
    if (open && user) {
      setDisplayName(user.displayName ?? '');
      setUsername(user.username ?? '');
      setBio(user.bio ?? '');
      setWebsite(user.website ?? '');
      setLocation(user.location ?? '');
      setDateOfBirth(user.dateOfBirth?.slice(0, 10) ?? '');
      setAvatarUrl(user.avatarUrl ?? '');
      setCoverImageUrl(user.coverImageUrl ?? '');
      originalAvatarUrlRef.current = user.avatarUrl ?? '';
      originalCoverUrlRef.current = user.coverImageUrl ?? '';
      pendingAvatarIdRef.current = null;
      pendingCoverIdRef.current = null;
    }
  }, [open, user]);

  const cleanupPending = (ref: React.MutableRefObject<string | null>) => {
    if (ref.current) {
      const publicId = ref.current;
      ref.current = null;
      deleteFromCloudinary(publicId).catch(() => {});
    }
  };

  const discardPendingUploads = () => {
    cleanupPending(pendingAvatarIdRef);
    cleanupPending(pendingCoverIdRef);
  };

  const uploadImage = async (
    file: File,
    folder: CloudinaryFolder,
    pendingRef: React.MutableRefObject<string | null>,
    setUrl: (url: string) => void,
    setUploading: (v: boolean) => void
  ) => {
    // replacing a pick that hasn't been saved yet - drop the orphaned upload
    cleanupPending(pendingRef);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await uploadToCloudinary(formData);

      if (!res.success) {
        toast.error(res.error || 'Failed to upload image');
        return;
      }

      if (!isOpenRef.current) {
        // dialog was closed while the upload was in flight, don't keep it around
        deleteFromCloudinary(res.data.publicId).catch(() => {});
        return;
      }

      setUrl(res.data.url);
      pendingRef.current = res.data.publicId;
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarFileChange = (file: File) => {
    uploadImage(file, AVATAR_FOLDER, pendingAvatarIdRef, setAvatarUrl, setIsUploadingAvatar);
  };

  const handleCoverFileChange = (file: File) => {
    uploadImage(file, COVER_FOLDER, pendingCoverIdRef, setCoverImageUrl, setIsUploadingCover);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const avatarWasReplaced = pendingAvatarIdRef.current !== null;
    const coverWasReplaced = pendingCoverIdRef.current !== null;
    const previousAvatarUrl = originalAvatarUrlRef.current;
    const previousCoverUrl = originalCoverUrlRef.current;

    updateProfileMutation.mutate(
      {
        displayName,
        username,
        bio,
        website,
        location,
        dateOfBirth: dateOfBirth || undefined,
        avatarUrl,
        coverImageUrl,
      },
      {
        onSuccess: () => {
          // now persisted - no longer orphan candidates
          pendingAvatarIdRef.current = null;
          pendingCoverIdRef.current = null;

          // clean up whatever image was just replaced, if any
          if (avatarWasReplaced && previousAvatarUrl) {
            deleteFromCloudinaryByUrl(previousAvatarUrl).catch(() => {});
          }
          if (coverWasReplaced && previousCoverUrl) {
            deleteFromCloudinaryByUrl(previousCoverUrl).catch(() => {});
          }

          toast.success('Profile updated');
          onSaved();
        },
        onError: (error: unknown) => {
          const apiError = extractApiError(error);
          toast.error(apiError.message);
        },
      }
    );
  };

  return {
    displayName,
    setDisplayName,
    username,
    setUsername,
    bio,
    setBio,
    website,
    setWebsite,
    location,
    setLocation,
    dateOfBirth,
    setDateOfBirth,
    avatarUrl,
    coverImageUrl,
    isUploadingAvatar,
    isUploadingCover,
    isSaving: updateProfileMutation.isPending,
    handleAvatarFileChange,
    handleCoverFileChange,
    handleSubmit,
    discardPendingUploads,
  };
}
