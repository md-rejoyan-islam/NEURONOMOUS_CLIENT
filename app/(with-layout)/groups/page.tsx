import GroupComponent from "@/components/groups/group-component";
import GroupCreateModal from "@/components/groups/group-create-modal";
import { FolderOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groups Management",
  description: "Create and manage device groups for better organization",
};

export default function GroupPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
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
