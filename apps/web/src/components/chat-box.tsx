'use client';

import { api } from '~/trpc/react';

export const ChatBox = () => {
  const chat = api.chat.chat.useMutation();
  return (
    <div className='absolute right-1/2 bottom-12 translate-x-1/2 rounded-3xl border border-black px-4'>
      <button
        type='button'
        onClick={async () => {
          const a = await chat.mutateAsync({ text: 'Hello!' });
          console.log(a);
        }}
        className='text-black'
      >
        Click
      </button>
    </div>
  );
};
