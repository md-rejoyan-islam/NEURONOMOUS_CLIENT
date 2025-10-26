import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="dark:bg-background flex min-h-screen items-center justify-center bg-[#f8fafc] p-4">
      {/* Theme Toggle Button - Top Right */}
      <div className="absolute top-4 right-4 z-[100]">
        <ThemeToggle />
      </div>
      <div className="absolute inset-0 z-0 [background-image:linear-gradient(to_right,_#e2e8f0_1px,_transparent_1px),linear-gradient(to_bottom,_#e2e8f0_1px,_transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,_#000_60%,_transparent_100%)] [background-size:35px_35px] [-webkit-mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,_#000_60%,_transparent_100%)] dark:[background-image:linear-gradient(to_right,_#0a172b_1px,_transparent_1px),linear-gradient(to_bottom,_#0b1c36_1px,_transparent_1px)]"></div>

      <div className="z-[100] mx-auto flex w-full items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
