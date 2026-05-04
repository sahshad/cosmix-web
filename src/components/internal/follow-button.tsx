import { Button } from "../ui/button";

export default function FollowButton() {
    return (
        <Button size="sm" className="h-[32px] rounded-full bg-foreground text-background hover:bg-[#2d7af1] hover:text-white font-extrabold px-4 transition-all shadow-md text-[11px] uppercase tracking-wider">
            Follow
        </Button>
    );
}