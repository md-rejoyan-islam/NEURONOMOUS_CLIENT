import { getGroupById } from "@/app/actions";
import SingleGroupComponent from "@/components/groups/single-group-component";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getGroupById(id);
  if (!data) {
    return {
      title: "Group Not Found",
      description: "The requested group does not exist.",
    };
  }
  return {
    title: data.name || "Group Details",
    description: data.description || "Details of the group",
  };
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
