'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { Spinner, UserAvatar } from '@/components/shared';

interface ProfileImageFieldsProps {
  displayName: string;
  avatarUrl: string;
  coverImageUrl: string;
  isUploadingAvatar: boolean;
  isUploadingCover: boolean;
  onAvatarFileChange: (file: File) => void;
  onCoverFileChange: (file: File) => void;
}

export function ProfileImageFields({
  displayName,
  avatarUrl,
  coverImageUrl,
  isUploadingAvatar,
  isUploadingCover,
  onAvatarFileChange,
  onCoverFileChange,
}: ProfileImageFieldsProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    onFile: (file: File) => void
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) onFile(file);
  };

  return (
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
          onChange={(e) => handleFileInput(e, onCoverFileChange)}
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
            onChange={(e) => handleFileInput(e, onAvatarFileChange)}
          />
        </button>
        <p className="text-[12px] text-muted-foreground pb-1.5">
          Click the cover or avatar to upload a new photo.
        </p>
      </div>
    </div>
  );
}
