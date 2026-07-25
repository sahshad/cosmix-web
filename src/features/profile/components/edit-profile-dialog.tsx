'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Link as LinkIcon, X } from 'lucide-react';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useEditProfileForm } from '../hooks/useEditProfileForm';
import { ProfileImageFields } from './profile-image-fields';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BIO_MAX_LENGTH = 500;

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { data: user } = useCurrentUser();
  const form = useEditProfileForm({ open, user, onSaved: () => onOpenChange(false) });

  const handleOpenChange = (next: boolean) => {
    if (!next) form.discardPendingUploads();
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="p-0 gap-0">
        <DialogHeader className="sticky top-0 z-20 bg-background flex-row items-start justify-between gap-4 space-y-0 px-6 pt-5 pb-4 border-b border-border">
            <DialogTitle>Edit profile</DialogTitle>
          <DialogClose
            className="shrink-0 p-1.5 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 hover:text-foreground"
            disabled={form.isSaving}
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={form.handleSubmit} className="contents">
        <div className="space-y-5 px-6 py-5">
          <ProfileImageFields
            displayName={form.displayName}
            avatarUrl={form.avatarUrl}
            coverImageUrl={form.coverImageUrl}
            isUploadingAvatar={form.isUploadingAvatar}
            isUploadingCover={form.isUploadingCover}
            onAvatarFileChange={form.handleAvatarFileChange}
            onCoverFileChange={form.handleCoverFileChange}
          />

          <div className="space-y-1.5">
            <Label htmlFor="displayName" className="text-[13px] font-bold text-foreground pl-1">
              Display name
            </Label>
            <Input
              id="displayName"
              type="text"
              value={form.displayName}
              onChange={(e) => form.setDisplayName(e.target.value)}
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
                value={form.username}
                onChange={(e) => form.setUsername(e.target.value)}
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
                {form.bio.length}/{BIO_MAX_LENGTH}
              </span>
            </div>
            <Textarea
              id="bio"
              placeholder="Tell people about yourself"
              value={form.bio}
              onChange={(e) => form.setBio(e.target.value.slice(0, BIO_MAX_LENGTH))}
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
                  value={form.website}
                  onChange={(e) => form.setWebsite(e.target.value)}
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
                  value={form.location}
                  onChange={(e) => form.setLocation(e.target.value)}
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
              value={form.dateOfBirth}
              onChange={(e) => form.setDateOfBirth(e.target.value)}
              className="h-11 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[14px] px-4 shadow-none"
            />
          </div>
        </div>

          <DialogFooter className="sticky bottom-0 z-20 bg-background px-6 py-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-xl border-border font-bold"
              onClick={() => handleOpenChange(false)}
              disabled={form.isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 rounded-xl bg-vivid-blue hover:bg-vivid-blue-hover text-white font-bold shadow-lg shadow-vivid-blue/20"
              disabled={form.isSaving || form.isUploadingAvatar || form.isUploadingCover}
            >
              {form.isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
