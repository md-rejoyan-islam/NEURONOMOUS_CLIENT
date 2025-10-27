import { useEffect, useState } from "react";

const TimeDateShow = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="text-right flex flex-row items-center gap-4">
        <div className="font-serif text-xl sm:text-2xl">
          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
        <div className="text-muted-foreground font-mono font-bold hidden sm:block text-sm">
          {currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </>
  );
};

export default TimeDateShow;
