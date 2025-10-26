import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Enrollment",
  description: "Enroll in your desired course easily and quickly.",
};

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}
