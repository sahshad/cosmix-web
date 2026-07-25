'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner, UserAvatar } from '@/components/shared';
import { Camera, MapPin, Link as LinkIcon } from 'lucide-react';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useUpdateProfile } from '../hooks/useUser';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteFromCloudinaryByUrl,
} from '@/actions/upload';
import type { CloudinaryFolder } from '@/lib/cloudinary';
import { toast } from 'sonner';
import { extractApiError } from '@/lib/error';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BIO_MAX_LENGTH = 500;
const AVATAR_FOLDER: CloudinaryFolder = 'avatars';
const COVER_FOLDER: CloudinaryFolder = 'covers';

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { data: user } = useCurrentUser();
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

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      cleanupPending(pendingAvatarIdRef);
      cleanupPending(pendingCoverIdRef);
    }
    onOpenChange(next);
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

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) uploadImage(file, AVATAR_FOLDER, pendingAvatarIdRef, setAvatarUrl, setIsUploadingAvatar);
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) uploadImage(file, COVER_FOLDER, pendingCoverIdRef, setCoverImageUrl, setIsUploadingCover);
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
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          const apiError = extractApiError(error);
          toast.error(apiError.message);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update how your profile appears to others on Cosmix.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cover image + Avatar */}
          <div className="-mx-6 -mt-1">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
              className="relative block w-full h-32 sm:h-36 bg-secondary overflow-hidden group"
              aria-label="Change cover image"
            >
              {coverImageUrl ? (
                <Image
                  src={coverImageUrl}
                  alt="Cover"
                  fill
                  sizes="(max-width: 640px) 100vw, 640px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-vivid-blue/20 via-secondary to-vivid-green/10" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                {isUploadingCover ? (
                  <Spinner size="lg" className="text-white" />
                ) : (
                  <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverFileChange}
              />
            </button>

            <div className="px-6 -mt-9 relative z-10 flex items-end gap-4">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="relative group shrink-0 rounded-2xl focus:outline-none"
                aria-label="Change avatar"
              >
                <UserAvatar
                  src={avatarUrl}
                  alt={displayName}
                  fallback={displayName ? displayName[0] : '?'}
                  className="h-16 w-16 rounded-2xl border-[3px] border-background shadow-lg"
                  imageClassName="object-cover"
                  fallbackClassName="rounded-2xl text-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 group-hover:bg-black/40 transition-colors">
                  {isUploadingAvatar ? (
                    <Spinner size="lg" className="text-white" />
                  ) : (
                    <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </button>
              <p className="text-[12px] text-muted-foreground pb-1.5">
                Click the cover or avatar to upload a new photo.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="displayName" className="text-[13px] font-bold text-foreground pl-1">
              Display name
            </Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={64}
              className="h-11 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[14px] px-4 shadow-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-[13px] font-bold text-foreground pl-1">
              Username
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-[14px] font-bold">
                @
              </span>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[14px] pl-8 pr-4 shadow-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between pl-1">
              <Label htmlFor="bio" className="text-[13px] font-bold text-foreground">
                Bio
              </Label>
              <span className="text-[11px] font-bold text-muted-foreground">
                {bio.length}/{BIO_MAX_LENGTH}
              </span>
            </div>
            <Textarea
              id="bio"
              placeholder="Tell people about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX_LENGTH))}
              maxLength={BIO_MAX_LENGTH}
              className="min-h-24 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[14px] px-4 py-3 shadow-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="website" className="text-[13px] font-bold text-foreground pl-1">
                Website
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-vivid-green" />
                <Input
                  id="website"
                  type="text"
                  placeholder="yoursite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  maxLength={255}
                  className="h-11 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[14px] pl-10 pr-4 shadow-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-[13px] font-bold text-foreground pl-1">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-vivid-red" />
                <Input
                  id="location"
                  type="text"
                  placeholder="San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={255}
                  className="h-11 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[14px] pl-10 pr-4 shadow-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dateOfBirth" className="text-[13px] font-bold text-foreground pl-1">
              Date of birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="h-11 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[14px] px-4 shadow-none"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-border font-bold"
              onClick={() => handleOpenChange(false)}
              disabled={updateProfileMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-xl bg-vivid-blue hover:bg-vivid-blue-hover text-white font-bold shadow-lg shadow-vivid-blue/20"
              disabled={updateProfileMutation.isPending || isUploadingAvatar || isUploadingCover}
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
