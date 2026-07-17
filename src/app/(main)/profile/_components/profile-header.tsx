'use client';

import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FollowButton from '@/components/shared/follow-button';

export interface ProfileData {
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  followers: number;
  following: number;
  isMe: boolean;
  verified: boolean;
}

interface ProfileHeaderProps {
  profile: ProfileData;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-card overflow-hidden">
      {/* Banner */}
      <div className="relative h-44 sm:h-56 bg-secondary overflow-hidden group">
        <img
          src={profile.banner}
          alt="Profile Banner"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Profile Meta */}
      <div className="px-8 relative pb-8">
        <div className="flex justify-between items-end -mt-14 sm:-mt-16 mb-6">
          <div className="relative">
            <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border-[6px] border-background shadow-2xl rounded-[2.5rem] overflow-hidden bg-background">
              <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
              <AvatarFallback className="text-3xl">{profile.name[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-2 right-2 h-6 w-6 bg-[#11a657] border-4 border-background rounded-full shadow-[0_0_15px_rgba(17,166,87,0.3)]" />
          </div>
          <div className="pb-2">
            {profile.isMe ? (
              <Button className="rounded-2xl border-border bg-foreground text-background hover:bg-foreground/90 font-bold px-6 h-11 transition-all shadow-lg active:scale-95 text-sm">
                <Edit2 className="h-4 w-4 mr-2" />
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
                {profile.name}
              </h2>
              {profile.verified && (
                <CheckCircle2 className="h-4 w-4 text-vivid-blue fill-vivid-blue/10" />
              )}
            </div>
            <p className="text-muted-foreground font-bold text-sm">{profile.handle}</p>
          </div>

          <p className="text-[14px] leading-relaxed text-foreground/80 max-w-xl font-medium">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-y-2 gap-x-5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-[#f84b4b]" />
              <span className="text-[12px] font-bold">{profile.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <LinkIcon className="h-3.5 w-3.5 text-[#11a657]" />
              <a
                href={`https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] font-bold hover:underline text-[#11a657]"
              >
                {profile.website}
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-[#f8b301]" />
              <span className="text-[12px] font-bold">{profile.joinDate}</span>
            </div>
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
    </Card>
  );
}
