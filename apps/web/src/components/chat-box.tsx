'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '~/hooks';
import { api } from '~/trpc/react';
import { Button } from './ui/button';
import { Input } from './ui/input';

import { Loader2Icon, SendHorizontalIcon } from 'lucide-react';

export const ChatBox = () => {
  const { getUserKey } = useUser();
  const sendMessage = api.chat.chat.useMutation();

  const [message, setMessage] = useState<string>('');

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['chat'],
    mutationFn: async () => {
      const keys = getUserKey();
      setMessage('');
      await sendMessage.mutateAsync({
        message,
        privateKeyStoreId: keys.storeId,
        seed: keys.seed,
        address: keys.address,
      });
    },
    onError(error) {
      toast.dismiss();
      toast.error(error.message);
    },
  });

  return (
    <div className='absolute right-1/2 bottom-12 mx-auto mt-6 flex w-full max-w-md translate-x-1/2 items-center justify-between rounded-[10px] bg-white p-[2px] shadow-sm'>
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
