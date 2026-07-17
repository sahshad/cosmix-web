import React from "react";
import { TrendingUp } from "lucide-react";

const trendingTopics = [
  { tag: "CosmixLaunch", posts: "125K", color: "from-[#60a5fa] to-[#3b82f6]" },
  { tag: "Nextjs14", posts: "89K", color: "from-[#4ade80] to-[#22c55e]" },
  { tag: "UIUXDesign", posts: "45K", color: "from-[#facc15] to-[#eab308]" },
  { tag: "WebDevelopment", posts: "32K", color: "from-[#fb7185] to-[#f43f5e]" },
  { tag: "IndieHacker", posts: "28K", color: "from-[#a78bfa] to-[#8b5cf6]" },
];

export function TrendingTopics() {
  return (
    <div>
      <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-foreground">
        <TrendingUp className="h-5 w-5 text-vivid-blue" />
        Trending in Cosmos
      </h2>
      <div className="flex gap-4 overflow-x-auto py-4 -mx-6 px-6 lg:mx-0 lg:px-0 custom-scrollbar snap-x">
        {trendingTopics.map((topic, idx) => (
          <div
            key={idx}
            className={`flex-shrink-0 w-[170px] h-[90px] rounded-[1.5rem] bg-gradient-to-br ${topic.color} p-4 relative overflow-hidden group cursor-pointer shadow-lg hover:-translate-y-1 transition-all duration-300 snap-center`}
          >
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10 h-full flex flex-col justify-between text-white">
              <span className="font-extrabold text-[15px] truncate">
                #{topic.tag}
              </span>
              <span className="text-sm font-medium text-white/80">
                {topic.posts} posts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
