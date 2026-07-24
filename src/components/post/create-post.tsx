"use client";

import React, { useRef, useState } from "react";
import { ImageIcon, MapPin, Calendar, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { uploadToCloudinary } from "@/actions/upload";
import { postService } from "@/services/post.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { MediaItem } from "@/types/post";
import { useCurrentUser } from "@/hooks/useAuth";

export function CreatePost() {
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const avatarUrl = user?.avatarUrl ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = async () => {
    if (!postContent.trim() && !selectedFile) return;

    setIsPosting(true);
    const mediaItems: MediaItem[] = [];

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await uploadToCloudinary(formData);
        if (uploadRes.success) {
          mediaItems.push({
            publicId: uploadRes.data.publicId,
            url: uploadRes.data.url,
            type: uploadRes.data.resourceType,
            duration: uploadRes.data.duration || 0,
          });
        } else {
          toast.error(uploadRes.error || "Failed to upload media");
          setIsPosting(false);
          return;
        }
      }

      await postService.createPost({ content: postContent, media: mediaItems });
      toast.success("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.feed] });
      setPostContent("");
      handleRemoveFile();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="p-2 border-0 shadow-[0_12px_40px_rgb(0,0,0,0.06)] rounded-[14px] bg-card flex flex-col focus-within:ring-4 ring-vivid-blue/10 transition-all duration-300">
      <div className="flex px-6 pt-6 pb-2">
        <Avatar className="h-12 w-12 flex-shrink-0 mr-4 mt-1 ring-2 ring-transparent">
          <AvatarImage
            src={avatarUrl}
            alt="You"
          />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="What's sparking your imagination today?"
            className="
            w-full
            min-w-0
            max-w-full
            resize-none
            border-0
            bg-transparent
            p-2
            text-[15px]
            font-medium
            whitespace-pre-wrap
            break-words
            overflow-wrap-anywhere
            break-all
            focus-visible:ring-0 "
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          {previewUrl && (
            <div className="relative mt-3 mb-2 w-max max-w-full">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[300px] rounded-2xl object-cover"
              />
              <button
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between bg-secondary/40 rounded-[2.5rem] py-2 px-3 m-2">
        <div className="flex gap-1">
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-10 rounded-full text-vivid-blue font-bold hover:bg-vivid-blue/10 hover:text-vivid-blue"
          >
            <ImageIcon className="h-[18px] w-[18px] sm:mr-2" />
            <span className="hidden sm:block">Media</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 rounded-full text-[#11a657] font-bold hover:bg-[#11a657]/10 hover:text-[#11a657]"
          >
            <MapPin className="h-[18px] w-[18px] sm:mr-2" />
            <span className="hidden sm:block">Location</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 rounded-full text-[#f8b301] font-bold hover:bg-[#f8b301]/10 hover:text-[#f8b301] hidden md:flex"
          >
            <Calendar className="h-[18px] w-[18px] mr-2" />
            Event
          </Button>
        </div>
        <Button
          onClick={handlePost}
          disabled={isPosting || (!postContent.trim() && !selectedFile)}
          className="bg-vivid-blue hover:bg-vivid-blue-hover text-white rounded-full px-7 h-10 shadow-lg shadow-vivid-blue/30 font-bold transition-all hover:scale-105 active:scale-95"
        >
          {isPosting ? "Posting..." : "Post"}
        </Button>
      </div>
    </Card>
  );
}
