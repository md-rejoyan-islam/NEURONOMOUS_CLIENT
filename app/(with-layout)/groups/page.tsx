import GroupComponent from '@/components/groups/group-component';
import GroupCreateModal from '@/components/groups/group-create-modal';
import { FolderOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Groups Management',
  description: 'Create and manage device groups for better organization',
};

export default function GroupPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <FolderOpen className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            All Groups Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage device groups for better organization
          </p>
        </div>
        <GroupCreateModal />
      </div>
      <GroupComponent />
    </div>
  );
}
