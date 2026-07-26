'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function ExploreSearch() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="relative group p-1">
            <div className="absolute -inset-1 bg-linear-to-r from-vivid-blue to-vivid-blue-dark rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur-md transition-opacity"></div>
            <div className="relative">
                <Input
                  placeholder="Search people, topics, or keywords..."
                  className="pl-14 pr-4 h-12 rounded-4xl border-0 bg-card/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-vivid-blue/30 transition-all font-bold text-[16px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-vivid-blue transition-colors" />
            </div>
        </div>
    );
}
