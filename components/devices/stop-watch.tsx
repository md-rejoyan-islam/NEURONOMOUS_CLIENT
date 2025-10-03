import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { IDevice } from '@/lib/types';
import { useStartStopWatchMutation } from '@/queries/devices';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import Timer from './timer';

type Time = { h: number; m: number; s: number };

const StopWatchNew = ({ device }: { device: IDevice }) => {
  const [timer, setTimer] = useState<Time>({ h: 0, m: 0, s: 0 });

  const [mode, setMode] = useState<'up' | 'down'>('down');
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>('12:00:00');

  const [startStopWatch] = useStartStopWatchMutation();
  const [timerStartOption, setTimerStartOption] = useState<'now' | 'schedule'>(
    'now'
  );

  const handleStartStopWatch = async () => {
    const start = new Date();

    const durationMs = (timer.h * 3600 + timer.m * 60 + timer.s) * 1000;
    const gmt6Offset = 6 * 60 * 60 * 1000;

    try {
      if (timerStartOption === 'now') {
        const startingDelay = 0 * 1000; // 10 seconds delay

        const data = {
          start_time: start.getTime() + startingDelay,
          end_time:
            new Date(start.getTime() + durationMs).getTime() + startingDelay,
          count_type: mode, // 'up' or 'down'
          is_scheduled: false,
        };

        await startStopWatch({ deviceId: device._id, data }).unwrap();
        setTimer({ h: 0, m: 0, s: 0 });
        return toast.success('Stopwatch Started', {
          description: `Stopwatch started in ${mode === 'up' ? 'Count Up' : 'Count Down'} mode.`,
        });
      }

      // for scheduled
      if (timerStartOption === 'schedule' && (!date || !time)) {
        return toast.error('Date and Time Required', {
          description: 'Please select both date and time for scheduled start.',
        });
      }
      const scheduledTimestamp =
        date && time
          ? new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              parseInt(time.split(':')[0], 10),
              parseInt(time.split(':')[1], 10),
              parseInt(time.split(':')[2], 10)
            ).getTime() + gmt6Offset
          : null;

      // validate scheduled time is in the future
      if (
        timerStartOption === 'schedule' &&
        scheduledTimestamp &&
        scheduledTimestamp < new Date().getTime() + gmt6Offset
      ) {
        return toast.error('Invalid Scheduled Time', {
          description: 'Please select a future date and time.',
        });
      }

      if (!scheduledTimestamp) {
        return;
      }

      const data = {
        start_time: scheduledTimestamp - gmt6Offset,
        end_time: scheduledTimestamp + durationMs - gmt6Offset,
        count_type: mode, // 'up' or 'down'
        is_scheduled: true,
      };
      setTimer({ h: 0, m: 0, s: 0 });
      await startStopWatch({ deviceId: device._id, data }).unwrap();
      toast.success('Scheduled Stopwatch Set', {
        description: `Stopwatch scheduled to start in ${mode === 'up' ? 'Count Up' : 'Count Down'} mode.`,
      });

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Update Failed', {
        description: error?.data?.message || 'Failed to update device mode.',
      });
    }
  };

  return (
    <Card>
      <CardContent className="grid items-center gap-6 md:grid-cols-2">
        <div>
          <div className="mx-auto flex w-fit items-center justify-center gap-2 font-mono">
            <Timer onSetTime={setTimer} timer={timer} />
          </div>
          <div className="flex items-center justify-center gap-6 pt-4">
            <p>Count Down</p>
            <div className="mt-1">
              <Switch
                className="scale-125 cursor-pointer"
                onCheckedChange={(checked) => setMode(checked ? 'up' : 'down')}
              />
            </div>
            <p>Count Up</p>
          </div>
        </div>
        <div className="">
          <div className="bg-primary/[0.01] mb-6 rounded-xl p-6">
            <h3 className="mb-4 font-semibold">Choose Timer Start Option</h3>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="start-now"
                  name="start-option"
                  value={timerStartOption}
                  checked={timerStartOption === 'now'}
                  onChange={() => setTimerStartOption('now')}
                  className="form-radio text-primary focus:ring-primary"
                />
                <label
                  htmlFor="start-now"
                  className="text-muted-foreground ml-2"
                >
                  Start Now
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="set-schedule"
                  name="start-option"
                  value={timerStartOption}
                  checked={timerStartOption === 'schedule'}
                  onChange={() => setTimerStartOption('schedule')}
                  className="form-radio text-primary focus:ring-primary"
                />
                <label
                  htmlFor="set-schedule"
                  className="text-muted-foreground ml-2"
                >
                  Set a Schedule
                </label>
              </div>
            </div>

            {timerStartOption === 'schedule' && (
              <div id="schedule-fields" className="mt-4 space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="date-picker" className="px-1">
                      Date
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date-picker"
                          className="w-32 justify-between font-normal"
                        >
                          {date ? date.toLocaleDateString() : 'Select date'}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          captionLayout="dropdown"
                          // show current data
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          onSelect={(date) => {
                            setDate(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="time-picker" className="px-1">
                      Time
                    </Label>
                    <Input
                      type="time"
                      id="time-picker"
                      step="1"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <Button
              className="w-full"
              disabled={
                (timer.h === 0 && timer.m === 0 && timer.s === 0) ||
                (device.status === 'offline' && timerStartOption !== 'schedule')
              }
              onClick={handleStartStopWatch}
            >
              Activate Timer
            </Button>
          </div>
        </div>

        {/* <ClockTimer /> */}
      </CardContent>
    </Card>
  );
};

export default StopWatchNew;
