'use client';

import { MessageSquareDotIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { ChatBox } from '../chat-box';
import { Button } from '../ui/button';
import { ChatSelect } from './chat-select';
import { ChatContent } from './content';

export const ChatsButton = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='absolute top-8 left-8 flex flex-row items-center gap-2'>
          <MessageSquareDotIcon className='h-5 w-5' />
          Chats
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='!max-w-2xl flex w-full flex-col gap-2'
      >
        <SheetHeader>
          <SheetTitle>Chats</SheetTitle>
          <SheetDescription>
            Select a existing chat to continue or create a new one.
          </SheetDescription>
        </SheetHeader>
        <ChatSelect />
        <ChatContent />
        <ChatBox className='w-full border' />
      </SheetContent>
    </Sheet>
  );
};
