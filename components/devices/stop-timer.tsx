import { Card, CardContent } from '@/components/ui/card';
import { useStopStopWatchMutation } from '@/queries/devices';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const StopTimer = ({
  stopwatchId,
  id,
}: {
  stopwatchId: string;
  id: string;
}) => {
  // Form states
  //   const [mode, setMode] = useState<'clock' | 'notice'>(device.mode);
  const [stopTimer, { isLoading }] = useStopStopWatchMutation();

  const handleStopSubmit = async () => {
    try {
      await stopTimer({
        deviceId: id,
        stopwatchId,
      }).unwrap();

      toast.success('Timer Stopped and Clock Mode Enabled', {
        description: `Device mode changed to clock.`,
      });
      // refetch();
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Update Failed', {
        description: error?.data?.message || 'Failed to update device mode.',
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <Label className="text-lg font-medium">
              <ShieldCheck className="text-primary inline-block h-6 w-6" />
              Stop Timer and Enable Clock Mode
            </Label>
            <p className="pt-2 text-sm">
              Currently the timer is running. Switch the device to Clock mode to
              stop the timer and display the current time.
            </p>
          </div>
          <Button disabled={isLoading} onClick={handleStopSubmit}>
            {isLoading ? 'Stopping...' : 'Stop Timer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StopTimer;
