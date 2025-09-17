import { getGroupById } from '@/app/actions';
import SingleGroupComponent from '@/components/groups/single-group-component';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const data = await getGroupById(id);
    return {
      title: data.name,
      description: data.description,
    };
  } catch {
    return {
      title: 'Group Not Found',
      description: 'The requested group does not exist.',
    };
  }
}

const SingleGroupPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    deviceType?: 'clock' | 'attendance';
    search?: string;
  }>;
}) => {
  const { id } = await params;
  const { deviceType, search } = await searchParams;
  return (
    <SingleGroupComponent
      _id={id}
      deviceType={deviceType || 'clock'}
      search={search || ''}
    />
  );
};

export default SingleGroupPage;
