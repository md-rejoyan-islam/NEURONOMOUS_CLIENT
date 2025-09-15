import GroupCreate from '@/components/groups/create-group';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Group with Admin',
  description: 'Create a new group along with an admin user',
};

const CreateGroupPage = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="mx-auto sm:max-w-[600px]">
        <GroupCreate />
      </div>
    </div>
  );
};

export default CreateGroupPage;
