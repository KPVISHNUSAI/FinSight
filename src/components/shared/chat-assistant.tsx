'use client';

import { useState, useTransition, useRef, useEffect, type FormEvent } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, MessageSquare, Send, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { handleChat } from '@/lib/actions';
import type { ConversationInput } from '@/ai/flows/conversational-assistant';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const initialMessages: Message[] = [
  {
    role: 'model',
    content: "Hello! I'm Insight, your AI assistant. How can I help you with your financial analysis today?",
  },
];

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const newUserMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput('');

    const chatInput: ConversationInput = {
      history: messages,
      message: input,
    };

    startTransition(async () => {
      const { response, error } = await handleChat(chatInput);

      if (error) {
        toast({
          title: 'Chat Error',
          description: error,
          variant: 'destructive',
        });
        setMessages(messages); 
        return;
      }

      if (response) {
        const newAiMessage: Message = { role: 'model', content: response };
        setMessages((prevMessages) => [...prevMessages, newAiMessage]);
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <MessageSquare className="h-7 w-7" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={16}
        align="end"
        className="w-full max-w-[400px] h-[600px] p-0 flex flex-col"
      >
        <div className="p-4 border-b">
          <h3 className="font-headline text-lg font-semibold">Relanto Insight</h3>
          <p className="text-sm text-muted-foreground">Your AI Assistant</p>
        </div>
        <ScrollArea className="flex-1" viewportRef={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'model' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'p-3 rounded-lg max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.role === 'user' ? (
                     <p className="text-sm break-words">{message.content}</p>
                  ) : (
                    <ReactMarkdown
                      className="prose prose-sm dark:prose-invert max-w-none prose-p:my-0"
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
                 {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isPending && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                            <Bot />
                        </AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-muted">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={isPending}
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
