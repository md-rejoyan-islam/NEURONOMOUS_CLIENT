import { ChangeEvent, TouchEvent, useEffect, useRef, WheelEvent } from 'react';

type Time = { h: number; m: number; s: number };

export default function Timer({
  onSetTime,
  timer,
}: {
  onSetTime: (time: Time) => void;
  timer: Time;
}) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatValue = (val: number) => String(val).padStart(2, '0');

  const updateTime = (key: keyof Time, value: number) => {
    if (value >= 0 && value <= 99) {
      onSetTime({ ...timer, [key]: value });
    }
  };

  useEffect(() => {
    const intervalId = intervalRef.current;
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleWheel = (
    e: WheelEvent<HTMLInputElement>,
    key: keyof Time,
    max: number
  ) => {
    e.preventDefault();
    const step = e.deltaY > 0 ? 1 : -1;
    const value = (timer[key] + step + (max + 1)) % (max + 1);
    updateTime(key, value);
    onSetTime({ ...timer, [key]: value });
  };

  const handleTouch = (key: keyof Time, max: number) => {
    let startY: number | null = null;

    const onTouchStart = (e: TouchEvent<HTMLInputElement>) => {
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent<HTMLInputElement>) => {
      if (startY === null) return;
      const diff = e.touches[0].clientY - startY;
      if (Math.abs(diff) > 15) {
        const step = diff > 0 ? 1 : -1;
        const value = (timer[key] + step + (max + 1)) % (max + 1);
        updateTime(key, value);
        startY = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => {
      startY = null;
    };

    return { onTouchStart, onTouchMove, onTouchEnd };
  };

  return (
    <div className="font-orbitron flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 flex justify-center space-x-8">
          {(['h', 'm', 's'] as (keyof Time)[]).map((key, idx) => {
            const max = key === 'h' ? 23 : 59;
            const labels = ['Hours', 'Minutes', 'Seconds'];
            const touch = handleTouch(key, max);
            return (
              <div key={key} className="flex flex-col items-center">
                <input
                  type="text"
                  value={formatValue(timer[key])}
                  className={
                    'text-primary bg-primary/[0.01] flex size-16 appearance-none items-center justify-center rounded-md border text-center text-4xl font-bold sm:h-24 sm:w-24 sm:text-5xl xl:h-[140px] xl:w-[140px] xl:text-6xl'
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const val =
                      parseInt(e.target.value.replace(/\D/g, '')) || 0;
                    onSetTime({
                      ...timer,
                      [key]: formatValue(Math.min(max, Math.max(0, val))),
                    });
                  }}
                  onWheel={(e) => handleWheel(e, key, max)}
                  onTouchStart={touch.onTouchStart}
                  onTouchMove={touch.onTouchMove}
                  onTouchEnd={touch.onTouchEnd}
                />
                <div className="text-muted-foreground mt-2 text-sm">
                  {labels[idx]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
