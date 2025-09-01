const NotFound = () => {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-primary text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        The page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFound;
