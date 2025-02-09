import { PlusIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useChat } from '~/hooks';
import { Button } from '../ui/button';

export const ChatSelect = () => {
  const { activeChatId, setActiveChatId, chats, createNewChat } = useChat();
  return (
    <div className='flex flex-row items-center gap-3'>
      <Select value={activeChatId ?? undefined} onValueChange={setActiveChatId}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select Chat' />
        </SelectTrigger>
        <SelectContent>
          {chats.map((chat) => (
            <SelectItem key={chat.id} value={chat.id}>
              {chat.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className='flex flex-row items-center gap-2'
        onClick={createNewChat}
      >
        <PlusIcon className='h-5 w-5' />
        Create
      </Button>
    </div>
  );
};
