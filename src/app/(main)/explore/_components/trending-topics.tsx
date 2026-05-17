import React from 'react';
import { TrendingUp } from 'lucide-react';

const trendingTopics = [
    { tag: 'CosmixLaunch', posts: '125K', color: 'from-[#2d7af1] to-[#1e5bba]' },
    { tag: 'Nextjs14', posts: '89K', color: 'from-[#11a657] to-[#0d8244]' },
    { tag: 'UIUXDesign', posts: '45K', color: 'from-[#f8b301] to-[#d99d01]' },
    { tag: 'WebDevelopment', posts: '32K', color: 'from-[#f84b4b] to-[#d93c3c]' },
    { tag: 'IndieHacker', posts: '28K', color: 'from-[#8b5cf6] to-[#6d28d9]' },
];

export function TrendingTopics() {
    return (
        <div>
            <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-[#2d7af1]" />
                Trending in Cosmos
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 custom-scrollbar snap-x">
                {trendingTopics.map((topic, idx) => (
                    <div
                        key={idx}
                        className={`flex-shrink-0 w-[180px] h-[100px] rounded-[1.5rem] bg-gradient-to-br ${topic.color} p-4 relative overflow-hidden group cursor-pointer shadow-lg hover:-translate-y-1 transition-all duration-300 snap-center`}
                    >
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between text-white">
                            <span className="font-extrabold text-[15px] truncate">#{topic.tag}</span>
                            <span className="text-sm font-medium text-white/80">{topic.posts} posts</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
