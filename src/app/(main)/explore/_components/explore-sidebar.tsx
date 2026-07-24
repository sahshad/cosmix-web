import React from 'react';
import { Users, MoreHorizontal, Star, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ExploreSidebar() {
    return (
        <div className="space-y-8 hidden lg:block">
            {/* Top Communities */}
            <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] rounded-[14px] bg-card p-6">
                <h2 className="text-sm font-bold text-muted-foreground mb-6 flex items-center gap-3 uppercase tracking-wider">
                    <div className="bg-[#8b5cf6]/10 p-1.5 rounded-lg">
                        <Star className="h-4 w-4 text-[#8b5cf6]" />
                    </div>
                    Top Communities
                </h2>
                <div className="space-y-4">
                    {[
                        { name: 'Frontend Devs', members: '124K', color: 'var(--brand-primary)' },
                        { name: 'UI/UX Design', members: '89K', color: '#11a657' },
                        { name: 'Startups', members: '56K', color: '#f8b301' },
                    ].map((community) => (
                        <div key={community.name} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-2xl hover:bg-secondary/40 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-secondary border border-border/50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-bold text-[14px] text-foreground group-hover:text-primary transition-colors">{community.name}</p>
                                    <p className="text-[12px] font-medium text-muted-foreground">{community.members} members</p>
                                </div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                <MoreHorizontal className="h-4 w-4 text-foreground" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Popular Topics - List Format */}
            <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] rounded-[14px] bg-card p-6">
                <h2 className="text-sm font-bold text-muted-foreground mb-6 flex items-center gap-3 uppercase tracking-wider">
                    <div className="bg-[#f84b4b]/10 p-1.5 rounded-lg">
                        <Activity className="h-4 w-4 text-[#f84b4b]" />
                    </div>
                    Popular Topics
                </h2>
                <div className="space-y-4">
                    {[
                        { topic: 'Artificial Intelligence', category: 'Technology' },
                        { topic: 'Remote Work', category: 'Career' },
                        { topic: 'Photography', category: 'Art' },
                        { topic: 'Space Exploration', category: 'Science' },
                    ].map((item) => (
                        <div key={item.topic} className="group cursor-pointer">
                            <p className="text-[12px] font-medium text-muted-foreground mb-0.5">{item.category}</p>
                            <p className="font-bold text-[15px] text-foreground group-hover:text-vivid-blue transition-colors">{item.topic}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
