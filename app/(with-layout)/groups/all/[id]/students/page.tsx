import GroupStudents from '@/components/groups/id/group-students';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Group Students',
  description: 'List of students in the group',
};

const GroupStudentsPage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string; search?: string; limit?: string };
}) => {
  const { id: _id } = await params;
  const searchQuery = await searchParams;
  const page = searchQuery.page || '1';
  const search = searchQuery.search || '';
  const limit = searchQuery.limit || '10';

  return (
    <div className="space-y-4 p-2 sm:p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/groups/all">Groups</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbLink asChild>
            <Link href={`/groups/all/${_id}`}>Group Details</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Students</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <GroupStudents _id={_id} page={page} search={search} limit={limit} />
    </div>
  );
};

export default GroupStudentsPage;
