import { getGroupById } from "@/app/actions";
import SingleGroupComponent from "@/components/groups/single-group-component";

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
      title: "Group Not Found",
      description: "The requested group does not exist.",
    };
  }
}

const SingleGroupPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <SingleGroupComponent _id={id} />;
};

export default SingleGroupPage;
