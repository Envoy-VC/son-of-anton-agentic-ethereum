'use client';

import { useMutation } from '@tanstack/react-query';
import { type ComponentProps, useState } from 'react';
import { toast } from 'sonner';
import { useAvatar, useChat, useUser } from '~/hooks';
import { api } from '~/trpc/react';
import { Button } from './ui/button';
import { Input } from './ui/input';

import { Loader2Icon, SendHorizontalIcon } from 'lucide-react';
import { cn } from '~/lib/utils';

export const ChatBox = ({ className, ...props }: ComponentProps<'div'>) => {
  const { getUserKey } = useUser();
  const { store } = useAvatar();
  const [message, setMessage] = useState<string>('');
  const { addMessages } = useChat();

  const chatStream = api.chat.chat.useMutation();
  const generateVoiceMessage = api.chat.voiceChat.useMutation();

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['chat'],
    mutationFn: async () => {
      const keys = getUserKey();
      await addMessages([{ role: 'user', content: message }]);
      const voiceRes = await generateVoiceMessage.mutateAsync({ message });
      const messages = [...store.messages, ...voiceRes];
      store.setMessages(messages);
      const res = await chatStream.mutateAsync({
        message,
        privateKeyStoreId: keys.storeId,
        seed: keys.seed,
        address: keys.address,
      });
      await addMessages(res);
    },
    onError(error) {
      toast.dismiss();
      toast.error(error.message);
    },
  });

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between rounded-[10px] bg-white p-[4px] shadow-sm',
        className
      )}
      {...props}
    >
      <Input
        className='rounded-3xl border-none shadow-none'
        placeholder='Write your message here.'
        value={message}
        disabled={isPending}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        className='rounded-lg bg-blue-500 text-white hover:bg-blue-500'
        size='icon'
        disabled={isPending}
        onClick={() => mutateAsync()}
      >
        {isPending ? (
          <Loader2Icon className='animate-spin text-white' />
        ) : (
          <SendHorizontalIcon className='text-white' />
        )}
      </Button>
    </div>
  );
};
