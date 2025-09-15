import GroupCourses from '@/components/groups/id/group-courses';
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
  title: 'Group Courses',
  description: 'List of courses in the group',
};

const GroupCoursesPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; search?: string; limit?: string }>;
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
            <BreadcrumbPage>Courses</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <GroupCourses _id={_id} page={page} search={search} limit={limit} />
    </div>
  );
};

export default GroupCoursesPage;
