import React from 'react';
import { Users } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import FollowButton from '@/components/internal/follow-button';

const suggestedCreators = [
    { name: 'Alex Chen', handle: 'alexchen', avatar: 'alex', bio: 'Frontend Wizard ✨' },
    { name: 'Emma Rodriguez', handle: 'emmarod', avatar: 'emma', bio: 'Product Designer' },
    { name: 'Marcus Lee', handle: 'marcuslee', avatar: 'marcus', bio: 'Backend Engineer 🚀' },
    { name: 'Sarah Johnson', handle: 'sarahj', avatar: 'sarah', bio: 'Tech Writer' },
];

export function DiscoverCreators() {
    return (
        <div>
            <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5 text-[#11a657]" />
                Discover Creators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedCreators.map((creator) => (
                    <Card key={creator.handle} className="p-4 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.5rem] bg-card flex items-center justify-between group hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all">
                        <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-[#11a657]/30 transition-all shadow-sm flex-shrink-0">
                                <AvatarImage
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.avatar}`}
                                    alt={creator.name}
                                />
                                <AvatarFallback>{creator.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 pr-2">
                                <p className="text-[15px] font-bold text-foreground group-hover:underline truncate">{creator.name}</p>
                                <p className="text-[12px] font-medium text-muted-foreground truncate">@{creator.handle}</p>
                            </div>
                        </div>
                        <FollowButton />
                    </Card>
                ))}
            </div>
        </div>
    );
}
