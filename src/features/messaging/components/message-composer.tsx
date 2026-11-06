'use client';

import { FormEvent, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Spinner } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ComposerCharCount } from '@/features/feed/components/composer-char-count';
import { useAutoGrowTextarea } from '@/features/feed/hooks/useAutoGrowTextarea';

const MAX_MESSAGE_LENGTH = 5000;

interface MessageComposerProps {
  onSend: (content: string) => Promise<unknown>;
  isSending: boolean;
}

export function MessageComposer({ onSend, isSending }: MessageComposerProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useAutoGrowTextarea(textareaRef, content);

  const submit = async () => {
    const value = content.trim();
    if (!value || isSending) return;

    setContent('');

    try {
      await onSend(value);
    } catch {
      setContent(value);
    } finally {
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  return (
    <div className="shrink-0 border-t border-border bg-background px-3 py-2 sm:border-0 sm:bg-transparent sm:px-2 sm:pb-1 sm:pt-0">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 rounded-xl border border-border bg-secondary/40 p-1.5 pl-3 shadow-none transition-[border-color,box-shadow] focus-within:border-vivid-blue/40 focus-within:ring-2 focus-within:ring-vivid-blue/10 sm:rounded-2xl sm:bg-card sm:p-2 sm:pl-4 sm:shadow-[0_12px_45px_rgb(0,0,0,0.06)]"
      >
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' || event.shiftKey) return;
            if (event.nativeEvent.isComposing) return;
            event.preventDefault();
            void submit();
          }}
          placeholder="Write a message..."
          aria-label="Message"
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          autoFocus
          className="max-h-36 min-h-9 flex-1 resize-none overflow-y-auto border-0 bg-transparent py-2 text-[13px] leading-relaxed shadow-none focus-visible:ring-0 sm:min-h-10 sm:py-2.5 sm:text-[13.5px] dark:bg-transparent"
        />

        <Button
          type="submit"
          size="icon"
          disabled={!content.trim() || isSending}
          aria-label="Send message"
          className="h-9 w-9 shrink-0 rounded-full bg-vivid-blue text-white shadow-md shadow-vivid-blue/20 transition-transform hover:scale-105 hover:bg-vivid-blue/90 disabled:opacity-40 disabled:hover:scale-100 sm:h-10 sm:w-10"
        >
          {isSending ? <Spinner size="md" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>

      <div className="mt-1 flex items-center justify-between gap-3 px-1 sm:mt-1.5 sm:px-4">
        <p className="hidden truncate text-[10.5px] font-medium text-muted-foreground sm:block">
          Enter to send, Shift+Enter for a new line
        </p>
        <div className="ml-auto">
          <ComposerCharCount length={content.length} limit={MAX_MESSAGE_LENGTH} warnAt={200} />
        </div>
      </div>
    </div>
  );
}
