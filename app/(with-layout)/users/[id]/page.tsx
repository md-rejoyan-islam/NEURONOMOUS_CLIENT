import { getUserById } from "@/app/actions";
import SingleUserComponent from "@/components/users/single-user-component";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const data = await getUserById(id);
    return {
      title: data.first_name + " " + data.last_name,
      description: data.description,
    };
  } catch {
    return {
      title: "User Not Found",
      description: "The requested user does not exist.",
    };
  }
}

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <SingleUserComponent userId={id} />;
};

export default UserPage;
