'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '~/hooks';
import { api } from '~/trpc/react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const CreateKeys = () => {
  const { storeUserKey } = useUser();
  const router = useRouter();
  const create = api.nillion.createPrivateKey.useMutation();

  const [alias, setAlias] = useState<string>('');

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['create-key'],
    mutationFn: async () => {
      const id = toast.loading('Creating Nillion Keys...');
      const seed = crypto.randomUUID();
      const key = await create.mutateAsync({ alias, seed });
      storeUserKey({ ...key, alias, seed });
      setAlias('');
      return id;
    },
    onError(error) {
      toast.dismiss();
      toast.error(error.message);
    },
    onSuccess(data) {
      toast.success('Keys Created Successfully.', { id: data });
      router.push('/chat');
    },
  });

  return (
    <div className='mx-auto mt-6 flex w-full max-w-xs items-center justify-between rounded-3xl p-[2px] shadow-sm'>
      <Input
        className='rounded-3xl border-none shadow-none'
        placeholder='Choose your key alias'
        value={alias}
        disabled={isPending}
        onChange={(e) => setAlias(e.target.value)}
      />
      <Button
        className='!text-xs h-8 w-[6rem] rounded-3xl bg-blue-500 text-white hover:bg-blue-500'
        disabled={isPending}
        onClick={() => mutateAsync()}
      >
        {isPending ? 'Creating...' : 'Create'}
      </Button>
    </div>
  );
};
