import { PlusIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Button } from '../ui/button';

export const ChatSelect = () => {
  return (
    <div className='flex flex-row items-center gap-3'>
      <Select>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select Chat' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='light'>Light</SelectItem>
          <SelectItem value='dark'>Dark</SelectItem>
          <SelectItem value='system'>System</SelectItem>
        </SelectContent>
      </Select>
      <Button className='flex flex-row items-center gap-2'>
        <PlusIcon className='h-5 w-5' />
        Create
      </Button>
    </div>
  );
};
