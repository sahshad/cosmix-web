'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  CheckCircle2,
  Edit,
} from 'lucide-react';
import { UserAvatar } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FollowButton from '@/components/shared/follow-button';
import { EditProfileDialog } from './edit-profile-dialog';

export interface ProfileData {
  displayName: string;
  username: string;
  avatarUrl: string;
  coverImageUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt?: string;
  followers: number;
  following: number;
  isMe: boolean;
  isVerified: boolean;
}

function formatJoinDate(dateString?: string): string | undefined {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return undefined;
  return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
}

interface ProfileHeaderProps {
  profile: ProfileData;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);
  const joinDate = formatJoinDate(profile.createdAt);

  return (
    <Card className="border-0 p-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] rounded-md bg-card overflow-hidden">
      {/* Banner */}
      <div className="relative h-44 sm:h-56 bg-secondary overflow-hidden group">
        {profile.coverImageUrl ? (
          <Image
            src={profile.coverImageUrl}
            alt="Profile Banner"
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-vivid-blue/20 via-secondary to-vivid-green/10" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Profile Meta */}
      <div className="px-8 relative pb-8">
        <div className="flex justify-between items-end -mt-14 sm:-mt-16 mb-6">
          <div className="relative">
            <UserAvatar
              src={profile.avatarUrl}
              alt={profile.displayName}
              fallback={profile.displayName[0]}
              className="h-28 w-28 sm:h-36 sm:w-36 border-[6px] border-background shadow-2xl rounded-[2.5rem] overflow-hidden bg-background"
              imageClassName="object-cover"
              fallbackClassName="text-3xl"
            />
            <div className="absolute bottom-2 right-2 h-6 w-6 bg-vivid-green border-4 border-background rounded-full shadow-[0_0_15px_rgba(17,166,87,0.3)]" />
          </div>
          <div className="pb-2">
            {profile.isMe ? (
              <Button
                onClick={() => setEditOpen(true)}
                className="h-8 rounded-full border border-border bg-secondary text-foreground hover:bg-secondary/80 font-extrabold px-4 transition-all shadow-md active:scale-95 text-[11px] uppercase tracking-wider"
              >
                <Edit className="h-3 w-3 mr-1.5" />
                Edit Profile
              </Button>
            ) : (
              <FollowButton />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {profile.displayName}
              </h2>
              {profile.isVerified && (
                <CheckCircle2 className="h-4 w-4 text-vivid-blue fill-vivid-blue/10" />
              )}
            </div>
            <p className="text-muted-foreground font-bold text-sm">@{profile.username}</p>
          </div>

          {profile.bio && (
            <p className="text-[14px] leading-relaxed text-foreground/80 max-w-xl font-medium">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-y-2 gap-x-5">
            {profile.location && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-vivid-red" />
                <span className="text-[12px] font-bold">{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <LinkIcon className="h-3.5 w-3.5 text-vivid-green" />
                <a
                  href={
                    profile.website.startsWith('http')
                      ? profile.website
                      : `https://${profile.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-bold hover:underline text-vivid-green"
                >
                  {profile.website}
                </a>
              </div>
            )}
            {joinDate && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-vivid-yellow" />
                <span className="text-[12px] font-bold">{joinDate}</span>
              </div>
            )}
          </div>

          <div className="flex gap-8 pt-2">
            <button className="flex items-center gap-1.5 group">
              <span className="text-base font-bold text-foreground group-hover:underline">
                {profile.following.toLocaleString()}
              </span>
              <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
                Following
              </span>
            </button>
            <button className="flex items-center gap-1.5 group">
              <span className="text-base font-bold text-foreground group-hover:underline">
                {profile.followers.toLocaleString()}
              </span>
              <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
                Followers
              </span>
            </button>
          </div>
        </div>
      </div>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
    </Card>
  );
}
