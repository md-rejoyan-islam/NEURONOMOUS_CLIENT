import Image from "next/image";

const HomepageFooter = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/50">
      <div className="container mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="flex flex-col items-center justify-between text-center md:flex-row md:text-left">
          <a href="#" className="flex items-center space-x-2">
            <Image
              src={"/logo.png"}
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold">Neuronomous</span>
          </a>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            &copy; 2025 Neuronomous. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HomepageFooter;
